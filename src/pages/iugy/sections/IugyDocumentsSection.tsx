import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { gsap } from '../../../lib/animation';
import { officialDocuments } from '../content/iugyContent';

type IugyDocumentsSectionProps = {
  prefersReducedMotion: boolean;
};

export function IugyDocumentsSection({
  prefersReducedMotion,
}: IugyDocumentsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const listenerCleanupTasks: Array<() => void> = [];

    const animationContext = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      timeline
        .fromTo(
          '.iugy-documents__heading > *',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
        )
        .fromTo(
          '.iugy-document-links > a',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
          '-=0.4',
        );

      const links = gsap.utils.toArray<HTMLAnchorElement>('.iugy-document-links > a');
      links.forEach((link) => {
        const icon = link.querySelector('.iugy-document-links__arrow');
        if (!icon) return;

        const handleMouseEnter = () => {
          gsap.to(icon, {
            x: 4,
            y: -4,
            scale: 1.1,
            duration: 0.3,
            ease: 'back.out(1.5)',
          });
        };
        const handleMouseLeave = () => {
          gsap.to(icon, { x: 0, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        };

        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);
        listenerCleanupTasks.push(() => {
          link.removeEventListener('mouseenter', handleMouseEnter);
          link.removeEventListener('mouseleave', handleMouseLeave);
        });
      });
    }, sectionRef);

    return () => {
      listenerCleanupTasks.forEach((cleanup) => cleanup());
      animationContext.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-documents" id="documentos" ref={sectionRef}>
      <div className="iugy-documents__heading">
        <FileText size={19} aria-hidden="true" />
        <p>Documentos oficiais</p>
        <h2>
          Acervo
          <br />
          institucional.
        </h2>
      </div>

      <div className="iugy-document-links">
        {officialDocuments.map((doc, index) => (
          <a href={doc.href} key={doc.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{doc.title}</strong>
              <p>{doc.description}</p>
            </div>
            <ArrowUpRight className="iugy-document-links__arrow" size={21} />
          </a>
        ))}
      </div>
    </section>
  );
}
