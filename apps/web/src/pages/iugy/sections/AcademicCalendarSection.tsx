import { useLayoutEffect, useRef } from 'react';
import type {
  IugyCalendarEvent,
  IugyEventsResponse,
  IugySelectionCycle,
} from '@yppon/contracts/iugy';
import { getCurrentIugySelectionCycle, getIugyEvents } from '../../../lib/api/iugyApi';
import { gsap } from '../../../lib/animation';
import {
  AsyncIugyResource,
  IugyCollectionSummary,
  IugyResourceState,
} from '../components/AsyncIugyResource';

type AcademicCalendarSectionProps = {
  eventsRequest: Promise<IugyEventsResponse>;
  prefersReducedMotion: boolean;
  selectionCycleRequest: Promise<IugySelectionCycle | null>;
};

export function AcademicCalendarSection({
  eventsRequest,
  prefersReducedMotion,
  selectionCycleRequest,
}: AcademicCalendarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const section = sectionRef.current;
    const animationContext = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.iugy-calendar__heading > *'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section.querySelector('.iugy-calendar__heading'),
            start: 'top 76%',
          },
        },
      );
    }, section);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      aria-labelledby="iugy-calendar-title"
      className="iugy-calendar"
      id="calendario"
      ref={sectionRef}
    >
      <div className="iugy-calendar__sun" aria-hidden="true" />

      <div className="iugy-calendar__grid">
        <div className="iugy-calendar__heading">
          <p className="eyebrow">Calendário acadêmico</p>
          <h2 id="iugy-calendar-title">
            Ciclo
            <br />
            <em>vigente.</em>
          </h2>
          <p>
            Os períodos acadêmicos organizam as atividades e os marcos institucionais do
            ciclo oficialmente vigente.
          </p>

          <AsyncIugyResource
            errorMessage="Não foi possível identificar o ciclo vigente."
            load={getCurrentIugySelectionCycle}
            pending={
              <IugyResourceState
                message="Carregando identificação do ciclo."
                variant="loading"
              />
            }
            request={selectionCycleRequest}
          >
            {(selectionCycle) =>
              selectionCycle ? (
                <p className="iugy-calendar__cycle">
                  {formatSelectionCycleLabel(selectionCycle)}
                </p>
              ) : (
                <IugyResourceState
                  message="Nenhum ciclo vigente está publicado no momento."
                  variant="empty"
                />
              )
            }
          </AsyncIugyResource>
        </div>

        <AsyncIugyResource
          errorMessage="Não foi possível carregar o calendário acadêmico."
          load={getIugyEvents}
          pending={<CalendarSkeleton />}
          request={eventsRequest}
        >
          {(response) =>
            response.data.length > 0 ? (
              <div className="iugy-calendar__content">
                <CalendarTimeline
                  events={response.data}
                  prefersReducedMotion={prefersReducedMotion}
                />
                <IugyCollectionSummary
                  shownItems={response.data.length}
                  totalItems={response.pagination.totalItems}
                />
              </div>
            ) : (
              <div className="calendar-timeline calendar-timeline--state">
                <IugyResourceState
                  message="Nenhum evento está publicado para o ciclo vigente."
                  variant="empty"
                />
              </div>
            )
          }
        </AsyncIugyResource>
      </div>
    </section>
  );
}

function formatSelectionCycleLabel(selectionCycle: IugySelectionCycle) {
  return selectionCycle.title === selectionCycle.periodLabel
    ? selectionCycle.title
    : `${selectionCycle.title} · ${selectionCycle.periodLabel}`;
}

type CalendarTimelineProps = {
  events: IugyCalendarEvent[];
  prefersReducedMotion: boolean;
};

function CalendarTimeline({ events, prefersReducedMotion }: CalendarTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !timelineRef.current) return undefined;

    const timeline = timelineRef.current;
    const animationContext = gsap.context(() => {
      const progress = timeline.querySelector('.calendar-timeline__progress');

      if (progress) {
        gsap.to(progress, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 1,
          },
        });
      }

      const eventElements = gsap.utils.toArray<HTMLElement>(
        timeline.querySelectorAll('.calendar-event'),
      );

      eventElements.forEach((event) => {
        const dot = event.querySelector('.calendar-event__dot');
        const content = event.querySelectorAll(
          '.calendar-event__period, .calendar-event__title, .calendar-event__description',
        );

        gsap.fromTo(
          content,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: event,
              start: 'top 75%',
            },
          },
        );

        if (dot) {
          gsap.to(dot, {
            backgroundColor: 'var(--iugy-accent)',
            borderColor: 'var(--gold)',
            boxShadow: '0 0 0 3px rgba(200, 164, 77, 0.2)',
            duration: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: event,
              start: 'top 50%',
            },
          });
        }
      });
    }, timeline);

    return () => animationContext.revert();
  }, [events, prefersReducedMotion]);

  return (
    <div className="calendar-timeline" ref={timelineRef}>
      <div className="calendar-timeline__progress" aria-hidden="true" />

      {events.map((event) => (
        <article className="calendar-event" key={event.id}>
          <span className="calendar-event__dot" aria-hidden="true" />
          <p className="calendar-event__period">{event.periodLabel}</p>
          <h3 className="calendar-event__title">{event.title}</h3>
          <p className="calendar-event__description">{event.description}</p>
        </article>
      ))}
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando calendário acadêmico"
      className="calendar-timeline calendar-timeline--loading"
      role="status"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          aria-hidden="true"
          className="calendar-event calendar-event--skeleton"
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
