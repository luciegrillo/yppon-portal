import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowUpRight, ChevronRight } from 'lucide-react';
import type { IugyInstitution } from '@yppon/contracts/iugy';
import iugyEmblemUrl from '../../../assets/iugy-emblem.webp';
import { getIugyInstitution } from '../../../lib/api/iugyApi';
import { gsap } from '../../../lib/animation';
import { AsyncIugyResource, IugyResourceState } from '../components/AsyncIugyResource';

type IugyHeroSectionProps = {
  institutionRequest: Promise<IugyInstitution | null>;
  prefersReducedMotion: boolean;
};

export function IugyHeroSection({
  institutionRequest,
  prefersReducedMotion,
}: IugyHeroSectionProps) {
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
        opacity: 0,
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
              opacity: 1,
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
              opacity: 1,
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
        <div className="iugy-hero__glow" aria-hidden="true" />
        <div className="iugy-hero__compass" aria-hidden="true">
          <span>N</span>
          <span>L</span>
          <span>S</span>
          <span>O</span>
        </div>

        <nav className="iugy-hero__breadcrumb" aria-label="Localização">
          <Link to="/">Portal</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">IUGY</span>
        </nav>

        <div className="iugy-hero__emblem" aria-hidden="true">
          <p className="iugy-emblem-type">Scientia · Civitas · Futurum · Yppon</p>
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
          <AsyncIugyResource
            errorMessage="Não foi possível carregar as informações institucionais."
            load={getIugyInstitution}
            pending={
              <IugyResourceState
                message="Carregando informações institucionais."
                variant="loading"
              />
            }
            request={institutionRequest}
          >
            {(institution) =>
              institution ? (
                <IugyInstitutionSummary institution={institution} />
              ) : (
                <IugyResourceState
                  message="Informações institucionais ainda não publicadas."
                  variant="empty"
                />
              )
            }
          </AsyncIugyResource>

          <h1>
            <span>Conhecimento</span>
            <span>
              <em>é soberania.</em>
            </span>
          </h1>
          <p className="iugy-hero__lead">
            Onde o saber deixa de ser promessa e se torna a infraestrutura intelectual de
            uma nação.
          </p>
          <a className="iugy-hero__action" href="#formacoes">
            Descobrir as formações
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div className="iugy-hero__facts" aria-label="Informações institucionais">
          <div>
            <strong>04</strong>
            <span>níveis de formação</span>
          </div>
          <div>
            <strong>IUGY</strong>
            <span>academia de Estado</span>
          </div>
          <div>
            <strong>YPP</strong>
            <span>jurisdição acadêmica</span>
          </div>
        </div>

        <div className="iugy-hero__scroll-cue" aria-hidden="true">
          <span>Conhecer o instituto</span>
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}

function IugyInstitutionSummary({ institution }: { institution: IugyInstitution }) {
  return (
    <div className="iugy-hero__kicker">
      <p className="eyebrow">{institution.name}</p>
      <span>{institution.acronym} · academia de Estado</span>
    </div>
  );
}
