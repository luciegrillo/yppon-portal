import { ConstitutionSection } from './sections/ConstitutionSection';
import { HeroSection } from './sections/HeroSection';
import { InstitutionsSection } from './sections/InstitutionsSection';
import { PublicAccessSection } from './sections/PublicAccessSection';

type HomePageProps = {
  isMenuOpen: boolean;
  prefersReducedMotion: boolean;
};

export function HomePage({
  isMenuOpen,
  prefersReducedMotion,
}: HomePageProps) {
  return (
    <main id="main-content">
      <HeroSection
        isMenuOpen={isMenuOpen}
        prefersReducedMotion={prefersReducedMotion}
      />
      <InstitutionsSection prefersReducedMotion={prefersReducedMotion} />
      <ConstitutionSection prefersReducedMotion={prefersReducedMotion} />
      <PublicAccessSection />
    </main>
  );
}
