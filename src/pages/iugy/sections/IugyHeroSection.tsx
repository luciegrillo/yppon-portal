import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import iugyEmblemUrl from '../../../assets/iugy-emblem.webp';
import { gsap } from '../../../lib/animation';

type IugyHeroSectionProps = {
  prefersReducedMotion: boolean;
};

export function IugyHeroSection({ prefersReducedMotion }: IugyHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      gsap.fromTo(
        '.iugy-hero__copy > *',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
        },
      );

      gsap.fromTo(
        '.iugy-hero__emblem',
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.3,
        },
      );

      gsap.to('.iugy-emblem-ring--outer', {
        rotate: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });

      gsap.to('.iugy-emblem-ring--inner', {
        rotate: -360,
        duration: 26,
        ease: 'none',
        repeat: -1,
      });
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-hero" ref={sectionRef}>
      <div className="iugy-hero__grain" aria-hidden="true" />

      <nav className="iugy-hero__breadcrumb" aria-label="Localização">
        <Link to="/">Portal</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">IUGY</span>
      </nav>

      <div className="iugy-hero__stage">
        <div className="iugy-hero__emblem" aria-hidden="true">
          <div className="iugy-emblem-ring iugy-emblem-ring--outer" />
          <div className="iugy-emblem-ring iugy-emblem-ring--inner" />
          <div className="iugy-emblem-core">
            <img
              src={iugyEmblemUrl}
              alt=""
              width="618"
              height="900"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="iugy-hero__copy">
          <p className="eyebrow">Instituto Universitário Governamental de Yppon</p>
          <h1>
            A formação que
            <br />
            <em>sustenta o Estado.</em>
          </h1>
          <p className="iugy-hero__lead">
            Formação estatal, editais acadêmicos e o acesso público à estrutura
            educacional de Yppon.
          </p>
        </div>
      </div>
    </section>
  );
}
