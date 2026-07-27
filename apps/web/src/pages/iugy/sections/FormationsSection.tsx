import { useLayoutEffect, useRef, type RefObject } from 'react';
import {
  BookOpen,
  Crown,
  GraduationCap,
  Microscope,
  type LucideIcon,
} from 'lucide-react';
import type { IugyProgram, IugyProgramsResponse } from '@yppon/contracts/iugy';
import { getIugyPrograms } from '../../../lib/api/iugyApi';
import { gsap } from '../../../lib/animation';
import {
  AsyncIugyResource,
  IugyCollectionSummary,
  IugyResourceState,
} from '../components/AsyncIugyResource';

type FormationsSectionProps = {
  prefersReducedMotion: boolean;
  programsRequest: Promise<IugyProgramsResponse>;
};

const FORMATION_ICONS: Record<string, LucideIcon> = {
  I: BookOpen,
  II: GraduationCap,
  III: Microscope,
  IV: Crown,
};

function FormationCard({ program, index }: { program: IugyProgram; index: number }) {
  const Icon = FORMATION_ICONS[program.levelCode] ?? GraduationCap;

  return (
    <article className="formation-card" data-index={index}>
      <div className="formation-card__header">
        <span className="formation-card__number">{program.levelCode}</span>
        <div className="formation-card__icon">
          <Icon strokeWidth={1.3} aria-hidden="true" />
        </div>
      </div>

      <h3 className="formation-card__title">{program.title}</h3>

      <span className="formation-card__reference">{program.externalReference}</span>

      <p className="formation-card__description">{program.description}</p>
    </article>
  );
}

export function FormationsSection({
  prefersReducedMotion,
  programsRequest,
}: FormationsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      aria-labelledby="iugy-formations-title"
      className="iugy-formations"
      id="formacoes"
      ref={sectionRef}
    >
      <div className="iugy-formations__heading">
        <p className="eyebrow">Estrutura acadêmica</p>
        <h2 id="iugy-formations-title">
          Níveis progressivos,
          <br />
          <em>uma formação.</em>
        </h2>
        <p className="iugy-formations__subtitle">
          A IUGY organiza a educação estatal em níveis progressivos, cada um com função
          própria e reconhecimento dentro da estrutura pública de Yppon.
        </p>
      </div>

      <AsyncIugyResource
        errorMessage="Não foi possível carregar as formações."
        load={getIugyPrograms}
        pending={<FormationSkeletons />}
        request={programsRequest}
      >
        {(response) =>
          response.data.length > 0 ? (
            <>
              <FormationGrid
                prefersReducedMotion={prefersReducedMotion}
                programs={response.data}
                sectionRef={sectionRef}
              />
              <IugyCollectionSummary
                shownItems={response.data.length}
                totalItems={response.pagination.totalItems}
              />
            </>
          ) : (
            <div className="iugy-formations__grid iugy-formations__grid--state">
              <IugyResourceState
                message="Nenhuma formação está publicada no momento."
                variant="empty"
              />
            </div>
          )
        }
      </AsyncIugyResource>
    </section>
  );
}

type FormationGridProps = {
  prefersReducedMotion: boolean;
  programs: IugyProgram[];
  sectionRef: RefObject<HTMLElement | null>;
};

function FormationGrid({
  prefersReducedMotion,
  programs,
  sectionRef,
}: FormationGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !gridRef.current) {
      return undefined;
    }

    const section = sectionRef.current;
    const grid = gridRef.current;
    const mediaContext = gsap.matchMedia();

    mediaContext.add('(min-width: 769px)', () => {
      gsap.fromTo(
        section.querySelectorAll('.iugy-formations__heading > *'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.iugy-formations__heading'),
            start: 'top 85%',
          },
        },
      );

      const getOverflow = () => Math.max(grid.scrollWidth - window.innerWidth + 80, 0);

      if (getOverflow() === 0) return;

      gsap.to(grid, {
        x: () => -getOverflow(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getOverflow()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    mediaContext.add('(max-width: 768px)', () => {
      gsap.fromTo(
        section.querySelectorAll('.iugy-formations__heading > *'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.iugy-formations__heading'),
            start: 'top 85%',
          },
        },
      );

      gsap.fromTo(
        grid.querySelectorAll('.formation-card'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 78%',
          },
        },
      );
    });

    return () => mediaContext.revert();
  }, [prefersReducedMotion, programs, sectionRef]);

  return (
    <div className="iugy-formations__grid" ref={gridRef}>
      {programs.map((program, index) => (
        <FormationCard program={program} index={index} key={program.id} />
      ))}
    </div>
  );
}

function FormationSkeletons() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando formações"
      className="iugy-formations__grid iugy-formations__grid--loading"
      role="status"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          aria-hidden="true"
          className="formation-card formation-card--skeleton"
          key={index}
        >
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
