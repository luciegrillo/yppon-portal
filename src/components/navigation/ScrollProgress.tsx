import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/animation';

type ScrollProgressProps = {
  prefersReducedMotion: boolean;
};

export function ScrollProgress({ prefersReducedMotion }: ScrollProgressProps) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !progressRef.current) return undefined;

    const progressTween = gsap.fromTo(
      progressRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.15,
        },
      },
    );

    return () => {
      progressTween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__label">Percurso</span>
      <div className="scroll-progress__track">
        <span ref={progressRef} />
      </div>
    </div>
  );
}
