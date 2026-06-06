import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../../lib/animation';
import { academicLevels } from '../content/iugyContent';

type FormationsSectionProps = {
  prefersReducedMotion: boolean;
};

function FormationCard({
  level,
  index,
}: {
  level: (typeof academicLevels)[number];
  index: number;
}) {
  const Icon = level.icon;

  return (
    <article className="formation-card" data-index={index}>
      <div className="formation-card__header">
        <span className="formation-card__number">{level.number}</span>
        <div className="formation-card__icon">
          <Icon strokeWidth={1.3} />
        </div>
      </div>

      <h3 className="formation-card__title">{level.title}</h3>

      <span className="formation-card__reference">{level.externalReference}</span>

      <p className="formation-card__description">{level.description}</p>
    </article>
  );
}

export function FormationsSection({ prefersReducedMotion }: FormationsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const mediaContext = gsap.matchMedia();

    mediaContext.add('(min-width: 769px)', () => {
      // 1. Entrance animation for heading
      gsap.fromTo(
        '.iugy-formations__heading > *',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-formations__heading',
            start: 'top 85%',
          },
        },
      );

      // 2. Horizontal pinning for cards
      const grid = document.querySelector('.iugy-formations__grid') as HTMLElement;
      if (grid) {
        // Calculate how much we need to scroll: total width of grid minus viewport width
        // Plus some padding so the last card doesn't stick right to the edge
        const getScrollAmount = () => -(grid.scrollWidth - window.innerWidth + 80);

        gsap.to(grid, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${grid.scrollWidth - window.innerWidth + 80}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    mediaContext.add('(max-width: 768px)', () => {
      // Mobile fallback: vertical stacking entrance
      gsap.fromTo(
        '.iugy-formations__heading > *',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-formations__heading',
            start: 'top 85%',
          },
        },
      );

      gsap.fromTo(
        '.formation-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-formations__grid',
            start: 'top 78%',
          },
        },
      );
    });

    return () => mediaContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-formations" id="formacoes" ref={sectionRef}>
      <div className="iugy-formations__heading">
        <p className="eyebrow">Estrutura acadêmica</p>
        <h2>
          Quatro níveis,
          <br />
          <em>uma formação.</em>
        </h2>
        <p className="iugy-formations__subtitle">
          A IUGY organiza a educação estatal em quatro níveis progressivos, cada um com
          função própria e reconhecimento dentro da estrutura pública de Yppon.
        </p>
      </div>

      <div className="iugy-formations__grid">
        {academicLevels.map((level, index) => (
          <FormationCard level={level} index={index} key={level.title} />
        ))}
      </div>
    </section>
  );
}
