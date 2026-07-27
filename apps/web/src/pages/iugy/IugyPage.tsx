import { useLoaderData, useOutletContext } from 'react-router';
import type { AppOutletContext } from '../../app/outletContext';
import type { IugyPageLoaderData } from '../../lib/api/iugyApi';
import './styles.css';
import { AcademicCalendarSection } from './sections/AcademicCalendarSection';
import { AcademicNoticesSection } from './sections/AcademicNoticesSection';
import { FormationsSection } from './sections/FormationsSection';
import { IugyDocumentsSection } from './sections/IugyDocumentsSection';
import { IugyHeroSection } from './sections/IugyHeroSection';

export function IugyPage() {
  const { prefersReducedMotion } = useOutletContext<AppOutletContext>();
  const data = useLoaderData<IugyPageLoaderData>();

  return (
    <main id="main-content" tabIndex={-1} className="iugy">
      <IugyHeroSection
        institutionRequest={data.institution}
        prefersReducedMotion={prefersReducedMotion}
      />
      <FormationsSection
        prefersReducedMotion={prefersReducedMotion}
        programsRequest={data.programs}
      />
      <AcademicNoticesSection
        noticesRequest={data.notices}
        prefersReducedMotion={prefersReducedMotion}
      />
      <AcademicCalendarSection
        eventsRequest={data.events}
        prefersReducedMotion={prefersReducedMotion}
        selectionCycleRequest={data.selectionCycle}
      />
      <IugyDocumentsSection prefersReducedMotion={prefersReducedMotion} />
    </main>
  );
}

export function IugyPageHydrateFallback() {
  return (
    <main
      aria-busy="true"
      aria-label="Carregando página pública da IUGY"
      className="iugy iugy-route-loading"
      id="main-content"
      tabIndex={-1}
    >
      <h1>Carregando Instituto Universitário Geral de Yppon</h1>
    </main>
  );
}
