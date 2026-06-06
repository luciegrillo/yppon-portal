import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from '../../../lib/animation';
import { institutions, type Institution } from '../content/homeContent';

type InstitutionsSectionProps = {
  prefersReducedMotion: boolean;
};

function InstitutionArtwork({
  institution,
  prefersReducedMotion,
}: {
  institution: Institution;
  prefersReducedMotion: boolean;
}) {
  const Icon = institution.icon;
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return undefined;

    const container = containerRef.current;

    const ringsAndCore = container.querySelectorAll('.visual-ring, .visual-core');
    const gridAndAxis = container.querySelectorAll('.visual-grid, .visual-axis');

    if (!ringsAndCore.length || !gridAndAxis.length) return undefined;

    const xTo = gsap.quickTo(ringsAndCore, 'x', { duration: 0.8, ease: 'power3' });
    const yTo = gsap.quickTo(ringsAndCore, 'y', { duration: 0.8, ease: 'power3' });
    const xToGrid = gsap.quickTo(gridAndAxis, 'x', { duration: 1.2, ease: 'power3' });
    const yToGrid = gsap.quickTo(gridAndAxis, 'y', { duration: 1.2, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      xTo(relX * 14);
      yTo(relY * 14);
      xToGrid(relX * -8);
      yToGrid(relY * -8);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      xToGrid(0);
      yToGrid(0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`institution-visual institution-visual--${institution.visualVariant}`}
      aria-hidden="true"
    >
      <div className="visual-grid" />
      <div className="visual-ring visual-ring--outer" />
      <div className="visual-ring visual-ring--inner" />
      <div className="visual-axis visual-axis--x" />
      <div className="visual-axis visual-axis--y" />
      <div className="visual-core">
        <Icon strokeWidth={1.15} />
      </div>
      <span className="visual-pulse visual-pulse--one" />
      <span className="visual-pulse visual-pulse--two" />
      <span className="visual-coordinate visual-coordinate--top">42° 11&apos; YP</span>
      <span className="visual-coordinate visual-coordinate--bottom">
        {institution.label.toUpperCase()}
      </span>
    </div>
  );
}

function InstitutionPanel({
  institution,
  index,
  prefersReducedMotion,
  onElementReady,
}: {
  institution: Institution;
  index: number;
  prefersReducedMotion: boolean;
  onElementReady: (element: HTMLElement | null) => void;
}) {
  return (
    <article
      className="institution-panel"
      id={institution.href.slice(1)}
      ref={onElementReady}
      data-index={index}
    >
      <div className="institution-panel__copy">
        <span className="institution-panel__number">{institution.number}</span>
        <p className="institution-panel__label">{institution.label}</p>
        <h3>{institution.title}</h3>
        <p className="institution-panel__description">{institution.description}</p>
        {institution.href.startsWith('/') ? (
          <Link to={institution.href}>
            Acessar instituição
            <ArrowUpRight size={18} />
          </Link>
        ) : (
          <a href={institution.href}>
            Acessar instituição
            <ArrowUpRight size={18} />
          </a>
        )}
      </div>

      <InstitutionArtwork
        institution={institution}
        prefersReducedMotion={prefersReducedMotion}
      />
    </article>
  );
}

export function InstitutionsSection({ prefersReducedMotion }: InstitutionsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelElementsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeInstitutionIndex, setActiveInstitutionIndex] = useState(0);

  useEffect(() => {
    const panelObservers = panelElementsRef.current.map((panel, index) => {
      if (!panel) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveInstitutionIndex(index);
        },
        { rootMargin: '-38% 0px -38% 0px', threshold: 0 },
      );

      observer.observe(panel);
      return observer;
    });

    return () => {
      panelObservers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      gsap.fromTo(
        '.institutions-heading h2',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.institutions-heading',
            start: 'top 82%',
            end: 'center 58%',
            scrub: 0.55,
          },
        },
      );

      panelElementsRef.current.forEach((panel, index) => {
        if (!panel) return;

        gsap.fromTo(
          panel.querySelector('.institution-panel__copy'),
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 72%',
              end: 'top 42%',
              scrub: 0.5,
            },
          },
        );

        gsap.fromTo(
          panel.querySelector('.institution-visual'),
          {
            y: 90,
            scale: 0.82,
            rotateX: index % 2 === 0 ? 8 : -8,
            rotateY: index % 2 === 0 ? -13 : 13,
            opacity: 0.25,
          },
          {
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top 88%',
              end: 'center 55%',
              scrub: 0.7,
            },
          },
        );

        gsap.to(panel.querySelector('.visual-grid'), {
          backgroundPositionY: index % 2 === 0 ? 90 : -90,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="institutions" id="instituicoes" ref={sectionRef}>
      <div className="institutions-heading">
        <p className="eyebrow">Instituições fundamentais</p>
        <h2>
          A arquitetura
          <br />
          <em>do Estado.</em>
        </h2>
        <p>Cinco instituições. Uma única soberana.</p>
      </div>

      <div className="institutions-layout">
        <aside className="institution-index" aria-label="Instituições">
          <p>Instituições fundamentais</p>
          <ol>
            {institutions.map((institution, index) => (
              <li
                className={activeInstitutionIndex === index ? 'is-active' : undefined}
                key={institution.shortTitle}
              >
                <a href={institution.href}>
                  <span>{institution.number}</span>
                  <strong>{institution.shortTitle}</strong>
                </a>
              </li>
            ))}
          </ol>

          <div className="index-progress">
            <span
              style={{
                transform: `scaleY(${(activeInstitutionIndex + 1) / institutions.length})`,
              }}
            />
          </div>
        </aside>

        <div className="institution-panels">
          {institutions.map((institution, index) => (
            <InstitutionPanel
              institution={institution}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              key={institution.title}
              onElementReady={(element) => {
                panelElementsRef.current[index] = element;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
