import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../../app/outletContext';
import { ConstitutionSection } from './sections/ConstitutionSection';
import { HeroSection } from './sections/HeroSection';
import { InstitutionsSection } from './sections/InstitutionsSection';
import { PublicAccessSection } from './sections/PublicAccessSection';

export function HomePage() {
  const { prefersReducedMotion } = useOutletContext<AppOutletContext>();

  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection prefersReducedMotion={prefersReducedMotion} />
      <InstitutionsSection prefersReducedMotion={prefersReducedMotion} />
      <ConstitutionSection prefersReducedMotion={prefersReducedMotion} />
      <PublicAccessSection prefersReducedMotion={prefersReducedMotion} />
    </main>
  );
}
