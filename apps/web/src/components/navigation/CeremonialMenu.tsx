import { useEffect, useRef, type CSSProperties } from 'react';
import { ArrowUpRight, LockKeyhole, X } from 'lucide-react';
import { primaryNavigation } from '../../config/navigation';
import { CURRENT_CYCLE } from '../../config/portal';

type CeremonialMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CeremonialMenu({ isOpen, onClose }: CeremonialMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    document.body.classList.add('menu-open');

    const focusableElements =
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);

    focusableElements?.[0]?.focus();

    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyboardNavigation);

    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', handleKeyboardNavigation);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="ceremonial-navigation"
      className={`ceremonial-menu${isOpen ? ' ceremonial-menu--open' : ''}`}
      aria-hidden={!isOpen}
    >
      <button
        className="menu-backdrop"
        type="button"
        aria-label="Fechar navegação"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <div
        className="menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navegação principal"
      >
        <div className="menu-panel__top">
          <span className="menu-panel__edition">
            Portal Oficial · Ciclo {CURRENT_CYCLE}
          </span>
          <button
            className="round-button round-button--light"
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="ceremonial-nav" aria-label="Navegação principal">
          {primaryNavigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
              style={
                {
                  '--nav-delay': `${120 + index * 80}ms`,
                } as CSSProperties
              }
            >
              <span>{item.number}</span>
              <strong>{item.label}</strong>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="menu-panel__footer">
          <a href="/#acesso-cidadao" onClick={onClose} tabIndex={isOpen ? 0 : -1}>
            <LockKeyhole size={16} />
            Acesso Cidadão
          </a>
          <p>Meritocracia Bipartite de Yppon</p>
        </div>
      </div>
    </div>
  );
}
