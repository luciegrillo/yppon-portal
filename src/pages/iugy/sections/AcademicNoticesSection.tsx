import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../../lib/animation';
import { academicNotices, type AcademicNotice } from '../content/iugyContent';

type AcademicNoticesSectionProps = {
  prefersReducedMotion: boolean;
};

const STATUS_LABEL: Record<AcademicNotice['status'], string> = {
  aberto: 'Aberto',
  encerrado: 'Encerrado',
  previsto: 'Previsto',
};

function AcademicNoticeItem({ notice }: { notice: AcademicNotice }) {
  return (
    <article className="academic-notice">
      <span className="academic-notice__code">{notice.code}</span>

      <div className="academic-notice__info">
        <strong className="academic-notice__title">{notice.title}</strong>
        <span className="academic-notice__level">{notice.level}</span>
      </div>

      <span
        className={`academic-notice__status academic-notice__status--${notice.status}`}
      >
        {STATUS_LABEL[notice.status]}
      </span>

      <span className="academic-notice__date">{notice.date}</span>
    </article>
  );
}

export function AcademicNoticesSection({
  prefersReducedMotion,
}: AcademicNoticesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      gsap.fromTo(
        '.iugy-notices__heading > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-notices__heading',
            start: 'top 78%',
          },
        },
      );

      gsap.set('.iugy-notices__list', { perspective: 1200 });

      gsap.fromTo(
        '.academic-notice',
        { y: 50, rotationX: -35, opacity: 0, transformOrigin: 'top center' },
        {
          y: 0,
          rotationX: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.iugy-notices__list',
            start: 'top 80%',
          },
        },
      );
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-notices" id="editais" ref={sectionRef}>
      <div className="iugy-notices__heading">
        <p className="eyebrow">Editais acadêmicos</p>
        <h2>
          Processos
          <br />
          seletivos.
        </h2>
        <p>Conteúdo provisório — não representa editais oficiais.</p>
      </div>

      <div className="iugy-notices__list">
        {academicNotices.map((notice) => (
          <AcademicNoticeItem notice={notice} key={notice.code} />
        ))}
      </div>
    </section>
  );
}
