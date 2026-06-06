import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import ypponFlagUrl from '../../../assets/yppon-flag.webp';
import { PortalSearch } from '../../../components/search/PortalSearch';
import { gsap } from '../../../lib/animation';
import { supportsWebGL } from '../../../lib/browser';

const YpponFlagScene = lazy(() => import('../three/YpponFlagScene'));

type HeroSectionProps = {
  isMenuOpen: boolean;
  prefersReducedMotion: boolean;
};

export function HeroSection({ isMenuOpen, prefersReducedMotion }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [isSceneVisible, setIsSceneVisible] = useState(true);
  const [isWebGLSupported] = useState(supportsWebGL);

  useEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement) return undefined;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsSceneVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );

    visibilityObserver.observe(stageElement);

    return () => visibilityObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) {
      scrollProgressRef.current = 0;
      return undefined;
    }

    const animationContext = gsap.context(() => {
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            scrollProgressRef.current = progress;
          },
        },
      });

      heroTimeline
        .to(
          '.flag-world',
          {
            scale: 0.76,
            yPercent: -8,
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
          '.hero-copy',
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: 'power2.out',
          },
          0.18,
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
          '.hero-copy',
          {
            opacity: 0,
            y: -38,
            duration: 0.24,
            ease: 'none',
          },
          0.76,
        );
    }, sectionRef);

    return () => animationContext.revert();
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
          <img className="flag-fallback" src={ypponFlagUrl} alt="" />
          {isWebGLSupported && (
            <Suspense fallback={null}>
              <YpponFlagScene
                progressRef={scrollProgressRef}
                isPaused={isMenuOpen || !isSceneVisible}
                prefersReducedMotion={prefersReducedMotion}
              />
            </Suspense>
          )}
        </div>

        <div className="hero-intro" aria-hidden="true">
          <span>Estado de Yppon</span>
          <i />
          <span>Portal unificado</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Meritocracia Bipartite · Ciclo 942</p>
          <h1>
            Uma nação
            <br />
            <em>em movimento.</em>
          </h1>
          <p className="hero-copy__lead">
            Acesso integrado às instituições que sustentam Yppon.
          </p>
          <PortalSearch />
        </div>

        <a className="scroll-cue" href="#orgaos">
          <span>Descobrir o Estado</span>
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
