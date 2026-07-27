import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getCurrentIugySelectionCycle,
  getIugyInstitution,
  loadIugyPageData,
} from '../../src/lib/api/iugyApi';

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

describe('IUGY public API client', () => {
  it('starts the five page requests in parallel with the route abort signal', async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) => {
      void init;
      return Promise.resolve(responseFor(String(input)));
    });
    vi.stubGlobal('fetch', fetchMock);

    const data = loadIugyPageData(controller.signal);

    expect(fetchMock).toHaveBeenCalledTimes(5);
    for (const [, options] of fetchMock.mock.calls) {
      expect(options?.signal).toBe(controller.signal);
    }

    const [events, institution, notices, programs, selectionCycle] = await Promise.all([
      data.events,
      data.institution,
      data.notices,
      data.programs,
      data.selectionCycle,
    ]);

    expect(institution?.acronym).toBe('IUGY');
    expect(programs.data).toHaveLength(1);
    expect(programs.pagination.totalItems).toBe(1);
    expect(notices.data).toHaveLength(1);
    expect(selectionCycle?.cycleNumber).toBe(1988);
    expect(events.data).toHaveLength(1);
    expect(fetchMock.mock.calls.map(([input]) => String(input))).toStrictEqual([
      '/api/v1/iugy/events?current=true&pageSize=100',
      '/api/v1/iugy',
      '/api/v1/iugy/notices?pageSize=100',
      '/api/v1/iugy/programs?pageSize=100',
      '/api/v1/iugy/selection-cycles/current',
    ]);
  });

  it('represents absent singular resources without turning them into failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(jsonResponse({ error: {} }, 404))),
    );

    await expect(getIugyInstitution()).resolves.toBeNull();
    await expect(getCurrentIugySelectionCycle()).resolves.toBeNull();
  });

  it('rejects failed and malformed responses with a safe public error', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: {} }, 503))
      .mockResolvedValueOnce(new Response('<html />', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getIugyInstitution()).rejects.toThrow(
      'Não foi possível carregar o conteúdo público da IUGY.',
    );
    await expect(getIugyInstitution()).rejects.toThrow(
      'Não foi possível carregar o conteúdo público da IUGY.',
    );
  });
});

function responseFor(path: string) {
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
      pagination: pagination(1),
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
          description: 'Recepção acadêmica.',
          displayOrder: 1,
          id: ids.event,
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt,
          selectionCycleId: ids.cycle,
          title: 'Abertura',
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
    totalPages: totalItems === 0 ? 0 : 1,
  };
}
