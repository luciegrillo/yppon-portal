import { useLayoutEffect, useRef, type RefObject } from 'react';
import type { IugyNotice, IugyNoticesResponse } from '@yppon/contracts/iugy';
import { getIugyNotices } from '../../../lib/api/iugyApi';
import { gsap } from '../../../lib/animation';
import {
  AsyncIugyResource,
  IugyCollectionSummary,
  IugyResourceState,
} from '../components/AsyncIugyResource';

type AcademicNoticesSectionProps = {
  noticesRequest: Promise<IugyNoticesResponse>;
  prefersReducedMotion: boolean;
};

const STATUS_LABEL: Record<IugyNotice['status'], string> = {
  aberto: 'Aberto',
  encerrado: 'Encerrado',
  previsto: 'Previsto',
};

function AcademicNoticeItem({ notice }: { notice: IugyNotice }) {
  return (
    <article className="academic-notice">
      <span className="academic-notice__code">{notice.code}</span>

      <div className="academic-notice__info">
        <strong className="academic-notice__title">{notice.title}</strong>
        <span className="academic-notice__level">{notice.levelLabel}</span>
      </div>

      <span
        className={`academic-notice__status academic-notice__status--${notice.status}`}
      >
        {STATUS_LABEL[notice.status]}
      </span>

      <span className="academic-notice__date">{notice.periodLabel}</span>
    </article>
  );
}

export function AcademicNoticesSection({
  noticesRequest,
  prefersReducedMotion,
}: AcademicNoticesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      aria-labelledby="iugy-notices-title"
      className="iugy-notices"
      id="editais"
      ref={sectionRef}
    >
      <div className="iugy-notices__heading">
        <p className="eyebrow">Editais acadêmicos</p>
        <h2 id="iugy-notices-title">
          Processos
          <br />
          seletivos.
        </h2>
        <p>Chamadas públicas e processos seletivos oficialmente publicados pela IUGY.</p>
      </div>

      <AsyncIugyResource
        errorMessage="Não foi possível carregar os editais."
        load={getIugyNotices}
        pending={<NoticesSkeleton />}
        request={noticesRequest}
      >
        {(response) =>
          response.data.length > 0 ? (
            <div className="iugy-notices__content">
              <NoticesList
                notices={response.data}
                prefersReducedMotion={prefersReducedMotion}
                sectionRef={sectionRef}
              />
              <IugyCollectionSummary
                shownItems={response.data.length}
                totalItems={response.pagination.totalItems}
              />
            </div>
          ) : (
            <div className="iugy-notices__list iugy-notices__list--state">
              <IugyResourceState
                message="Nenhum edital está publicado no momento."
                variant="empty"
              />
            </div>
          )
        }
      </AsyncIugyResource>
    </section>
  );
}

type NoticesListProps = {
  notices: IugyNotice[];
  prefersReducedMotion: boolean;
  sectionRef: RefObject<HTMLElement | null>;
};

function NoticesList({ notices, prefersReducedMotion, sectionRef }: NoticesListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !listRef.current) {
      return undefined;
    }

    const section = sectionRef.current;
    const list = listRef.current;
    const animationContext = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.iugy-notices__heading > *'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.iugy-notices__heading'),
            start: 'top 78%',
          },
        },
      );

      gsap.set(list, { perspective: 1200 });

      gsap.fromTo(
        list.querySelectorAll('.academic-notice'),
        { y: 50, rotationX: -35, opacity: 0, transformOrigin: 'top center' },
        {
          y: 0,
          rotationX: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: list,
            start: 'top 80%',
          },
        },
      );
    }, section);

    return () => animationContext.revert();
  }, [notices, prefersReducedMotion, sectionRef]);

  return (
    <div className="iugy-notices__list" ref={listRef}>
      {notices.map((notice) => (
        <AcademicNoticeItem notice={notice} key={notice.id} />
      ))}
    </div>
  );
}

function NoticesSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando editais"
      className="iugy-notices__list iugy-notices__list--loading"
      role="status"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          aria-hidden="true"
          className="academic-notice academic-notice--skeleton"
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
