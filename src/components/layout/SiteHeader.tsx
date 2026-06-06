import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import ypponIconUrl from '../../assets/yppon-icon-transparent.webp';
import { CURRENT_CYCLE } from '../../config/portal';
import { CeremonialMenu } from '../navigation/CeremonialMenu';

type SiteHeaderProps = {
  isMenuOpen: boolean;
  onMenuOpenChange: (isOpen: boolean) => void;
};

export function SiteHeader({ isMenuOpen, onMenuOpenChange }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderState = () => setIsScrolled(window.scrollY > 48);

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    return () => window.removeEventListener('scroll', updateHeaderState);
  }, []);

  return (
    <>
      <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Yppon, página inicial">
          <img src={ypponIconUrl} alt="" aria-hidden="true" />
          <span>
            <strong>Yppon</strong>
            <small>Portal Oficial</small>
          </span>
        </a>

        <div className="header-cycle" aria-hidden="true">
          <span>Meritocracia Bipartite</span>
          <i />
          <span>Ciclo {CURRENT_CYCLE}</span>
        </div>

        <button
          className="menu-trigger"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="ceremonial-navigation"
          onClick={() => onMenuOpenChange(true)}
        >
          <span>Menu</span>
          <Menu size={21} aria-hidden="true" />
        </button>
      </header>

      <CeremonialMenu isOpen={isMenuOpen} onClose={() => onMenuOpenChange(false)} />
    </>
  );
}
