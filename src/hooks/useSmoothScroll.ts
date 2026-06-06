import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/animation';

type UseSmoothScrollOptions = {
  disabled?: boolean;
};

export function useSmoothScroll({ disabled = false }: UseSmoothScrollOptions = {}) {
  useEffect(() => {
    if (disabled) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      syncTouch: false,
      anchors: true,
    });

    const synchronizeScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', synchronizeScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', synchronizeScrollTrigger);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [disabled]);
}
