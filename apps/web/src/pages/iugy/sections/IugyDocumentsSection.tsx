import { useLayoutEffect, useRef } from 'react';
import { FileText } from 'lucide-react';
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
          '.iugy-document-item',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
          '-=0.4',
        );
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="iugy-documents" id="documentos" ref={sectionRef}>
      <div className="iugy-documents__heading">
        <FileText size={19} aria-hidden="true" />
        <p className="eyebrow">Documentos oficiais</p>
        <h2>
          Acervo
          <br />
          institucional.
        </h2>
      </div>

      <div className="iugy-document-links">
        {officialDocuments.map((doc, index) => (
          <article className="iugy-document-item" key={doc.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{doc.title}</strong>
              <p>{doc.description}</p>
            </div>
            <small>{doc.status === 'preparacao' ? 'Em preparação' : ''}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
