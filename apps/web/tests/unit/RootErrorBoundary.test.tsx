import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { RootErrorBoundary } from '../../src/app/RootErrorBoundary';
import { portalRoutes } from '../../src/app/router';

function BrokenRoute(): never {
  throw new Error('detalhe interno que não deve aparecer');
}

describe('RootErrorBoundary', () => {
  it('is registered as the boundary for the root route', () => {
    expect(portalRoutes[0].ErrorBoundary).toBe(RootErrorBoundary);
  });

  it('replaces a fatal render with a focused and safe recovery message', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const router = createMemoryRouter(
      [
        {
          path: '/',
          Component: BrokenRoute,
          ErrorBoundary: RootErrorBoundary,
        },
      ],
      { initialEntries: ['/'] },
    );

    render(<RouterProvider router={router} />);

    const alert = await screen.findByRole('alert');
    const main = alert.closest('main');

    expect(alert).toHaveTextContent(/não foi possível abrir\s*esta página/i);
    expect(main).toHaveFocus();
    expect(screen.queryByText(/detalhe interno/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeEnabled();
    expect(screen.getByRole('link', { name: /retornar ao portal/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
