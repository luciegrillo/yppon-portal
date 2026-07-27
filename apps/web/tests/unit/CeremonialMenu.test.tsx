import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CeremonialMenu } from '../../src/components/navigation/CeremonialMenu';

function MenuHarness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir navegação
      </button>
      <CeremonialMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

describe('CeremonialMenu', () => {
  it('contains keyboard focus, closes with Escape and restores the trigger focus', async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    const trigger = screen.getByRole('button', { name: /abrir navegação/i });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /navegação principal/i });
    const closeButton = screen.getByRole('button', { name: /fechar menu/i });
    const lastLink = screen.getByRole('link', { name: /acesso cidadão/i });

    expect(dialog).toBeInTheDocument();
    expect(closeButton).toHaveFocus();
    expect(document.body).toHaveClass('menu-open');

    await user.tab({ shift: true });
    expect(lastLink).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: /navegação principal/i }),
    ).not.toBeInTheDocument();
    expect(document.body).not.toHaveClass('menu-open');
    expect(trigger).toHaveFocus();
  });

  it('closes from the backdrop without leaving the document locked', async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);

    await user.click(screen.getByRole('button', { name: /abrir navegação/i }));
    await user.click(screen.getByRole('button', { name: /fechar navegação/i }));

    expect(document.body).not.toHaveClass('menu-open');
  });
});
