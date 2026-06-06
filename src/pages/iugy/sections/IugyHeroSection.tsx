import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ChevronRight } from 'lucide-react';
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
      gsap.set('.iugy-hero__emblem', {
        top: '46%',
        left: '50%',
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      });

      gsap.fromTo(
        '.iugy-emblem-core',
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.3,
        },
      );

      gsap.set('.iugy-hero__copy', {
        autoAlpha: 0,
        y: 48,
      });

      const mediaContext = gsap.matchMedia();

      mediaContext.add('(min-width: 701px)', () => {
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        scrollTimeline
          .to(
            '.iugy-hero__emblem',
            {
              x: () => Math.min(window.innerWidth * 0.23, 360),
              y: -30,
              scale: 0.78,
              duration: 0.7,
              ease: 'none',
            },
            0,
          )
          .to(
            '.iugy-hero__scroll-cue',
            {
              autoAlpha: 0,
              y: -12,
              duration: 0.12,
              ease: 'none',
            },
            0,
          )
          .to(
            '.iugy-hero__copy',
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              ease: 'power2.out',
            },
            0.2,
          );
      });

      mediaContext.add('(max-width: 700px)', () => {
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        scrollTimeline
          .to(
            '.iugy-hero__emblem',
            {
              y: () => -Math.min(window.innerHeight * 0.22, 190),
              scale: 0.62,
              opacity: 0.58,
              duration: 0.7,
              ease: 'none',
            },
            0,
          )
          .to(
            '.iugy-hero__scroll-cue',
            {
              autoAlpha: 0,
              y: -12,
              duration: 0.12,
              ease: 'none',
            },
            0,
          )
          .to(
            '.iugy-hero__copy',
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              ease: 'power2.out',
            },
            0.2,
          );
      });

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

      return () => mediaContext.revert();
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-hero" ref={sectionRef}>
      <div className="iugy-hero__stage">
        <div className="iugy-hero__grain" aria-hidden="true" />

        <nav className="iugy-hero__breadcrumb" aria-label="Localização">
          <Link to="/">Portal</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">IUGY</span>
        </nav>

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

        <div className="iugy-hero__scroll-cue" aria-hidden="true">
          <span>Conhecer o instituto</span>
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}
