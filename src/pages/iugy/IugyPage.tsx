import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../../app/outletContext';
import './styles.css';
import { AcademicCalendarSection } from './sections/AcademicCalendarSection';
import { AcademicNoticesSection } from './sections/AcademicNoticesSection';
import { FormationsSection } from './sections/FormationsSection';
import { IugyDocumentsSection } from './sections/IugyDocumentsSection';
import { IugyHeroSection } from './sections/IugyHeroSection';

export function IugyPage() {
  const { prefersReducedMotion } = useOutletContext<AppOutletContext>();

  return (
    <main id="main-content" tabIndex={-1} className="iugy">
      <IugyHeroSection prefersReducedMotion={prefersReducedMotion} />
      <FormationsSection prefersReducedMotion={prefersReducedMotion} />
      <AcademicNoticesSection prefersReducedMotion={prefersReducedMotion} />
      <AcademicCalendarSection prefersReducedMotion={prefersReducedMotion} />
      <IugyDocumentsSection prefersReducedMotion={prefersReducedMotion} />
    </main>
  );
}
