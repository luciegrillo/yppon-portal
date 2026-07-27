import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { portalRoutes } from '../../src/app/router';

vi.mock('../../src/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}));

vi.mock('../../src/app/useRouteLifecycle', () => ({
  useRouteLifecycle: vi.fn(),
}));

const ids = {
  cycle: '00000000-0000-4000-8000-000000001988',
  event: '00000000-0000-4000-8000-000000005001',
  institution: '00000000-0000-4000-8000-000000000001',
  notice: '00000000-0000-4000-8000-000000003001',
  program: '00000000-0000-4000-8000-000000002001',
};

const publishedAt = '1988-02-01T00:00:00.000Z';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('IUGY API-backed page', () => {
  it('renders the five public resources without duplicate requests', async () => {
    const fetchMock = vi.fn((input: string | URL | Request) =>
      Promise.resolve(successResponse(String(input))),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderIugyRoute();

    expect(
      await screen.findByRole('heading', { level: 1, name: /conhecimento/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Instituto Universitário Geral de Yppon'),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { level: 3, name: 'Nível Técnico' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Admissão pública')).toBeInTheDocument();
    expect(
      await screen.findByText('Ciclo 1988', { selector: '.iugy-calendar__cycle' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Abertura acadêmica')).toBeInTheDocument();
    expect(
      await screen.findByText('Exibindo os primeiros 1 de 101 registros publicados.'),
    ).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(new Set(fetchMock.mock.calls.map(([input]) => String(input)))).toEqual(
      new Set([
        '/api/v1/iugy',
        '/api/v1/iugy/programs?pageSize=100',
        '/api/v1/iugy/notices?pageSize=100',
        '/api/v1/iugy/selection-cycles/current',
        '/api/v1/iugy/events?current=true&pageSize=100',
      ]),
    );
  });

  it('announces loading and keeps global navigation available', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => undefined)),
    );

    renderIugyRoute();

    expect(
      await screen.findByRole('heading', { level: 1, name: /conhecimento/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    expect(
      screen.getByRole('status', {
        name: 'Carregando informações institucionais.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /carregando formações/i })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByRole('status', { name: /carregando editais/i })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(
      screen.getByRole('status', { name: /carregando calendário acadêmico/i }),
    ).toHaveAttribute('aria-busy', 'true');
  });

  it('renders accessible empty states for unpublished resources', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL | Request) => {
        const path = String(input);

        if (path === '/api/v1/iugy' || path.endsWith('/selection-cycles/current')) {
          return Promise.resolve(jsonResponse({ error: {} }, 404));
        }

        return Promise.resolve(
          jsonResponse({
            data: [],
            pagination: pagination(0),
          }),
        );
      }),
    );

    renderIugyRoute();

    expect(
      await screen.findByRole('status', {
        name: 'Informações institucionais ainda não publicadas.',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('status', {
        name: 'Nenhuma formação está publicada no momento.',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('status', {
        name: 'Nenhum edital está publicado no momento.',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('status', {
        name: 'Nenhum ciclo vigente está publicado no momento.',
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('status', {
        name: 'Nenhum evento está publicado para o ciclo vigente.',
      }),
    ).toBeInTheDocument();
  });

  it('isolates a failed resource and retries only that endpoint', async () => {
    const fetchMock = vi.fn((input: string | URL | Request) => {
      const path = String(input);
      const programCalls = fetchMock.mock.calls.filter(([calledInput]) =>
        String(calledInput).includes('/programs?'),
      ).length;

      if (path.includes('/programs?') && programCalls === 1) {
        return Promise.resolve(jsonResponse({ error: {} }, 503));
      }

      return Promise.resolve(successResponse(path));
    });
    vi.stubGlobal('fetch', fetchMock);

    renderIugyRoute();

    const error = await screen.findByRole('alert', {
      name: /não foi possível carregar as formações/i,
    });

    expect(await screen.findByText('Admissão pública')).toBeInTheDocument();
    expect(await screen.findByText('Abertura acadêmica')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();

    await userEvent.click(
      within(error).getByRole('button', { name: /tentar novamente/i }),
    );

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Nível Técnico' }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(6);

    const callsByPath = fetchMock.mock.calls.map(([input]) => String(input));
    expect(callsByPath.filter((path) => path.includes('/programs?'))).toHaveLength(2);
    expect(callsByPath.filter((path) => path.includes('/notices?'))).toHaveLength(1);
    expect(callsByPath.filter((path) => path.includes('/events?'))).toHaveLength(1);
  });
});

function renderIugyRoute() {
  const router = createMemoryRouter(portalRoutes, {
    initialEntries: ['/instituicoes/iugy'],
  });

  return render(<RouterProvider router={router} />);
}

function successResponse(path: string) {
  if (path.endsWith('/programs?pageSize=100')) {
    return jsonResponse({
      data: [
        {
          description: 'Formação estatal.',
          displayOrder: 1,
          externalReference: 'Referência pública',
          id: ids.program,
          levelCode: 'I',
          publishedAt,
          title: 'Nível Técnico',
        },
      ],
      pagination: pagination(101),
    });
  }

  if (path.endsWith('/notices?pageSize=100')) {
    return jsonResponse({
      data: [
        {
          code: 'IUGY-1988/001',
          formationId: ids.program,
          id: ids.notice,
          levelLabel: 'Nível Técnico',
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt,
          selectionCycleId: ids.cycle,
          status: 'aberto',
          title: 'Admissão pública',
        },
      ],
      pagination: pagination(1),
    });
  }

  if (path.endsWith('/selection-cycles/current')) {
    return jsonResponse({
      data: {
        cycleNumber: 1988,
        id: ids.cycle,
        periodLabel: 'Ciclo 1988',
        publishedAt,
        title: 'Ciclo 1988',
      },
    });
  }

  if (path.includes('/events?')) {
    return jsonResponse({
      data: [
        {
          description: 'Recepção e primeiros módulos.',
          displayOrder: 1,
          id: ids.event,
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt,
          selectionCycleId: ids.cycle,
          title: 'Abertura acadêmica',
        },
      ],
      pagination: pagination(1),
    });
  }

  return jsonResponse({
    data: {
      acronym: 'IUGY',
      description: 'Universidade pública de Yppon.',
      id: ids.institution,
      name: 'Instituto Universitário Geral de Yppon',
      publishedAt,
      slug: 'iugy',
    },
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}

function pagination(totalItems: number) {
  return {
    page: 1,
    pageSize: 100,
    totalItems,
    totalPages: Math.ceil(totalItems / 100),
  };
}
