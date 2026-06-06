import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../../lib/animation';
import { edictals, type Edital } from '../content/iugyContent';

type EdictalsSectionProps = {
  prefersReducedMotion: boolean;
};

const STATUS_LABEL: Record<Edital['status'], string> = {
  aberto: 'Aberto',
  encerrado: 'Encerrado',
  previsto: 'Previsto',
};

function EditalItem({ edital }: { edital: Edital }) {
  return (
    <article className="edital-item">
      <span className="edital-item__code">{edital.code}</span>

      <div className="edital-item__info">
        <strong className="edital-item__title">{edital.title}</strong>
        <span className="edital-item__level">{edital.level}</span>
      </div>

      <span className={`edital-item__status edital-item__status--${edital.status}`}>
        {STATUS_LABEL[edital.status]}
      </span>

      <span className="edital-item__date">{edital.date}</span>
    </article>
  );
}

export function EdictalsSection({ prefersReducedMotion }: EdictalsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      gsap.fromTo(
        '.iugy-edictals__heading > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-edictals__heading',
            start: 'top 78%',
          },
        },
      );

      gsap.fromTo(
        '.edital-item',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-edictals__list',
            start: 'top 80%',
          },
        },
      );
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-edictals" id="editais" ref={sectionRef}>
      <div className="iugy-edictals__heading">
        <p className="eyebrow">Editais acadêmicos</p>
        <h2>
          Processos
          <br />
          seletivos.
        </h2>
        <p>Conteúdo provisório — não representa editais oficiais.</p>
      </div>

      <div className="iugy-edictals__list">
        {edictals.map((edital) => (
          <EditalItem edital={edital} key={edital.code} />
        ))}
      </div>
    </section>
  );
}
