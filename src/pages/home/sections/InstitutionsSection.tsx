import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '../../../lib/animation';
import { institutions, type Institution } from '../content/homeContent';

type InstitutionsSectionProps = {
  prefersReducedMotion: boolean;
};

function InstitutionArtwork({ institution }: { institution: Institution }) {
  const Icon = institution.icon;

  return (
    <div
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
  onElementReady,
}: {
  institution: Institution;
  index: number;
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
        <span className="institution-panel__number">
          {institution.number.padStart(2, '0')}
        </span>
        <p className="institution-panel__label">{institution.label}</p>
        <h3>{institution.title}</h3>
        <p className="institution-panel__description">{institution.description}</p>
        <a href={institution.href}>
          Acessar instituição
          <ArrowUpRight size={18} />
        </a>
      </div>

      <InstitutionArtwork institution={institution} />
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
      panelElementsRef.current.forEach((panel) => {
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
      });
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="institutions" id="orgaos" ref={sectionRef}>
      <div className="institutions-heading">
        <p className="eyebrow">Estruturas fundamentais</p>
        <h2>
          A arquitetura
          <br />
          <em>do Estado.</em>
        </h2>
        <p>Cinco instituições. Um sistema público conectado.</p>
      </div>

      <div className="institutions-layout">
        <aside className="institution-index" aria-label="Instituições">
          <p>Órgãos centrais</p>
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
