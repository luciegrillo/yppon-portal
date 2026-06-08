import { useLayoutEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import ypponFlagUrl from '../../../assets/yppon-flag.webp';
import { PortalSearch } from '../../../components/search/PortalSearch';
import { CURRENT_CYCLE } from '../../../config/portal';
import { gsap } from '../../../lib/animation';

type HeroSectionProps = {
  prefersReducedMotion: boolean;
};

export function HeroSection({ prefersReducedMotion }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      heroTimeline
        .to(
          '.flag-world',
          {
            scale: 0.84,
            xPercent: 8,
            yPercent: -5,
            duration: 0.62,
            ease: 'none',
          },
          0,
        )
        .to(
          '.hero-vignette',
          {
            opacity: 0.82,
            duration: 0.35,
            ease: 'none',
          },
          0.08,
        )
        .to(
          '.hero-disclosure',
          {
            autoAlpha: 1,
            pointerEvents: 'auto',
            y: 0,
            duration: 0.16,
            ease: 'power2.out',
          },
          0.01,
        )
        .to(
          '.hero-orbit',
          {
            rotate: 28,
            scale: 1.08,
            duration: 0.72,
            ease: 'none',
          },
          0,
        )
        .to(
          '.hero-headline',
          {
            opacity: 0,
            y: -38,
            duration: 0.12,
            ease: 'none',
          },
          0.88,
        )
        .to(
          '.hero-disclosure',
          {
            autoAlpha: 0,
            pointerEvents: 'none',
            y: -24,
            duration: 0.1,
            ease: 'none',
          },
          0.9,
        );
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !stageRef.current) return undefined;

    const stage = stageRef.current;
    const flagParallax = stage.querySelector<HTMLElement>('.flag-parallax');
    const orbit = stage.querySelector<HTMLElement>('.hero-orbit');
    if (!flagParallax || !orbit) return undefined;

    const moveFlagX = gsap.quickTo(flagParallax, 'x', {
      duration: 1.4,
      ease: 'power3.out',
    });
    const moveFlagY = gsap.quickTo(flagParallax, 'y', {
      duration: 1.4,
      ease: 'power3.out',
    });
    const moveOrbitX = gsap.quickTo(orbit, 'xPercent', {
      duration: 1.8,
      ease: 'power3.out',
    });
    const moveOrbitY = gsap.quickTo(orbit, 'yPercent', {
      duration: 1.8,
      ease: 'power3.out',
    });

    const handlePointerMove = (event: PointerEvent) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      moveFlagX(normalizedX * 28);
      moveFlagY(normalizedY * 18);
      moveOrbitX(-50 + normalizedX * -3);
      moveOrbitY(-50 + normalizedY * -3);
    };

    const resetParallax = () => {
      moveFlagX(0);
      moveFlagY(0);
      moveOrbitX(-50);
      moveOrbitY(-50);
    };

    stage.addEventListener('pointermove', handlePointerMove);
    stage.addEventListener('pointerleave', resetParallax);

    return () => {
      stage.removeEventListener('pointermove', handlePointerMove);
      stage.removeEventListener('pointerleave', resetParallax);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="hero" id="inicio" ref={sectionRef}>
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-vignette" />
        <div className="hero-grain" />

        <div className="hero-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="flag-world" aria-hidden="true">
          <div className="flag-parallax">
            <img className="flag-backdrop" src={ypponFlagUrl} alt="" />
          </div>
        </div>

        <div className="hero-copy">
          <div className="hero-headline">
            <p className="eyebrow">Meritocracia Bipartite · Ciclo {CURRENT_CYCLE}</p>
            <h1>
              A ordem sustenta
              <br />
              <em>o progresso.</em>
            </h1>
          </div>

          <div className="hero-disclosure">
            <p className="hero-copy__lead">
              Acesso integrado às instituições que sustentam Yppon.
            </p>
            <PortalSearch />
          </div>
        </div>

        <a className="scroll-cue" href="#instituicoes">
          <span>Descobrir o Estado</span>
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
