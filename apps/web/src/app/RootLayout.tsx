import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { ScrollProgress } from '../components/navigation/ScrollProgress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useRouteLifecycle } from './useRouteLifecycle';
import type { AppOutletContext } from './outletContext';

export function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useSmoothScroll({ disabled: prefersReducedMotion });
  useRouteLifecycle();

  const outletContext: AppOutletContext = {
    prefersReducedMotion,
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>

      <SiteHeader isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />
      <ScrollProgress prefersReducedMotion={prefersReducedMotion} />

      <Outlet context={outletContext} />

      <SiteFooter />
    </div>
  );
}
