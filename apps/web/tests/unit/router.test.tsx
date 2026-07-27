import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { portalRoutes } from '../../src/app/router';

vi.mock('../../src/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}));

vi.mock('../../src/app/useRouteLifecycle', () => ({
  useRouteLifecycle: vi.fn(),
}));

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

    expect(heading).toHaveTextContent(/a ordem sustenta\s*o progresso/i);
  });

  it('renders the IUGY public page at its canonical path', async () => {
    renderRoute('/instituicoes/iugy');

    const heading = await screen.findByRole('heading', {
      hidden: true,
      level: 1,
    });

    expect(heading).toHaveTextContent(/a formação que\s*sustenta o estado/i);
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
