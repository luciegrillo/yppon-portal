import { ConstitutionSection } from './sections/ConstitutionSection';
import { HeroSection } from './sections/HeroSection';
import { InstitutionsSection } from './sections/InstitutionsSection';
import { PublicAccessSection } from './sections/PublicAccessSection';

type HomePageProps = {
  prefersReducedMotion: boolean;
};

export function HomePage({ prefersReducedMotion }: HomePageProps) {
  return (
    <main id="main-content">
      <HeroSection prefersReducedMotion={prefersReducedMotion} />
      <InstitutionsSection prefersReducedMotion={prefersReducedMotion} />
      <ConstitutionSection prefersReducedMotion={prefersReducedMotion} />
      <PublicAccessSection prefersReducedMotion={prefersReducedMotion} />
    </main>
  );
}
