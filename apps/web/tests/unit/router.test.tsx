import { render, screen } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { portalRoutes } from '../../src/app/router';

vi.mock('../../src/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}));

vi.mock('../../src/app/useRouteLifecycle', () => ({
  useRouteLifecycle: vi.fn(),
}));

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string | URL | Request) => {
      const path = String(input);

      if (path === '/api/v1/iugy' || path.endsWith('/selection-cycles/current')) {
        return Promise.resolve(new Response('{}', { status: 404 }));
      }

      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: [],
            pagination: {
              page: 1,
              pageSize: 100,
              totalItems: 0,
              totalPages: 0,
            },
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          },
        ),
      );
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderRoute(path: string) {
  const router = createMemoryRouter(portalRoutes, {
    initialEntries: [path],
  });

  return render(<RouterProvider router={router} />);
}

describe('public portal routes', () => {
  it('renders the institutional home at the root path', async () => {
    renderRoute('/');

    const heading = await screen.findByRole('heading', {
      hidden: true,
      level: 1,
    });

    expect(heading).toHaveTextContent(/a ordem\s*sustenta\s*o progresso/i);
  });

  it('renders the IUGY public page at its canonical path', async () => {
    renderRoute('/instituicoes/iugy');

    const heading = await screen.findByRole('heading', {
      hidden: true,
      level: 1,
    });

    expect(heading).toHaveTextContent(/conhecimento\s*é soberania/i);
    expect(screen.getByRole('navigation', { name: /localização/i })).toHaveTextContent(
      'IUGY',
    );
  });

  it('renders a recoverable not-found page for unknown paths', async () => {
    renderRoute('/arquivo-inexistente');

    const heading = await screen.findByRole('heading', {
      hidden: true,
      level: 1,
    });

    expect(heading).toHaveTextContent(/esta rota não consta\s*nos arquivos/i);
    expect(screen.getByRole('link', { name: /retornar ao portal/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
