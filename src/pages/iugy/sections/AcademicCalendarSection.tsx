import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../../lib/animation';
import { calendarEvents } from '../content/iugyContent';

type AcademicCalendarSectionProps = {
  prefersReducedMotion: boolean;
};

export function AcademicCalendarSection({
  prefersReducedMotion,
}: AcademicCalendarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      gsap.fromTo(
        '.iugy-calendar__heading > *',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.iugy-calendar__heading',
            start: 'top 76%',
          },
        },
      );

      gsap.fromTo(
        '.calendar-event',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.09,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.calendar-timeline',
            start: 'top 78%',
          },
        },
      );
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-calendar" id="calendario" ref={sectionRef}>
      <div className="iugy-calendar__grid">
        <div className="iugy-calendar__heading">
          <p className="eyebrow">Calendário acadêmico</p>
          <h2>
            Ciclo
            <br />
            <em>1988.</em>
          </h2>
          <p>
            Fases letivas, períodos de avaliação e marcos institucionais do ciclo vigente.
          </p>
        </div>

        <div className="calendar-timeline">
          {calendarEvents.map((event) => (
            <article className="calendar-event" key={event.period}>
              <span className="calendar-event__dot" aria-hidden="true" />
              <p className="calendar-event__period">{event.period}</p>
              <h3 className="calendar-event__title">{event.title}</h3>
              <p className="calendar-event__description">{event.description}</p>
            </article>
          ))}
        </div>
      </div>

      <p className="iugy-calendar__provisional">
        Conteúdo provisório — não representa o calendário oficial.
      </p>
    </section>
  );
}
