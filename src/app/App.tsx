import { useState } from 'react';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { HomePage } from '../pages/home/HomePage';

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useSmoothScroll({ disabled: prefersReducedMotion });

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>

      <SiteHeader
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      />

      <HomePage
        isMenuOpen={isMenuOpen}
        prefersReducedMotion={prefersReducedMotion}
      />

      <SiteFooter />
    </div>
  );
}
