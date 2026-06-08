import { useEffect, useRef } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { ScrollTrigger } from '../lib/animation';

export function useRouteLifecycle() {
  const location = useLocation();
  const navigation = useNavigation();
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (navigation.state !== 'idle') return undefined;

    const pathnameChanged = previousPathnameRef.current !== location.pathname;
    previousPathnameRef.current = location.pathname;

    const animationFrame = window.requestAnimationFrame(() => {
      if (pathnameChanged) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }

      ScrollTrigger.refresh();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [location.pathname, navigation.state]);
}
