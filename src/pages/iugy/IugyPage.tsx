import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../../app/outletContext';
import { AcademicCalendarSection } from './sections/AcademicCalendarSection';
import { EdictalsSection } from './sections/EdictalsSection';
import { FormationsSection } from './sections/FormationsSection';
import { IugyDocumentsSection } from './sections/IugyDocumentsSection';
import { IugyHeroSection } from './sections/IugyHeroSection';

export function IugyPage() {
  const { prefersReducedMotion } = useOutletContext<AppOutletContext>();

  return (
    <main id="main-content" tabIndex={-1} className="iugy">
      <IugyHeroSection prefersReducedMotion={prefersReducedMotion} />
      <FormationsSection prefersReducedMotion={prefersReducedMotion} />
      <EdictalsSection prefersReducedMotion={prefersReducedMotion} />
      <AcademicCalendarSection prefersReducedMotion={prefersReducedMotion} />
      <IugyDocumentsSection prefersReducedMotion={prefersReducedMotion} />
    </main>
  );
}
