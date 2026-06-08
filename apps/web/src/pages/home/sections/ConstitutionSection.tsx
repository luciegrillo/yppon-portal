import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, BookOpenText } from 'lucide-react';
import ypponEmblemUrl from '../../../assets/yppon-icon-transparent.webp';
import { gsap } from '../../../lib/animation';

type ConstitutionSectionProps = {
  prefersReducedMotion: boolean;
};

export function ConstitutionSection({ prefersReducedMotion }: ConstitutionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      gsap.to('.constitution-sun', {
        xPercent: -10,
        yPercent: 12,
        scale: 1.16,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.fromTo(
        '.constitution-emblem-frame',
        { scale: 0.82, rotate: -4, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 76%',
            end: 'center 56%',
            scrub: 0.7,
          },
        },
      );

      gsap.to('.constitution-mark', {
        y: -55,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.fromTo(
        '.constitution-copy > *',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 58%',
          },
        },
      );
    }, sectionRef);

    return () => animationContext.revert();
  }, [prefersReducedMotion]);

  return (
    <section className="constitution" id="constituicao" ref={sectionRef}>
      <div className="constitution-sun" aria-hidden="true" />

      <div className="constitution-grid">
        <div className="constitution-mark">
          <span>A lei acima de tudo</span>
          <div className="constitution-emblem-frame">
            <span aria-hidden="true" />
            <img
              className="constitution-emblem"
              src={ypponEmblemUrl}
              alt="Emblema oficial do Estado de Yppon"
            />
          </div>
          <p>Sagrada Constituição · Arquivo Central</p>
        </div>

        <div className="constitution-copy">
          <p className="eyebrow">Fundamento constitucional</p>
          <h2>
            A lei é a única
            <br />
            <em>soberana.</em>
          </h2>
          <p>
            Repositório oficial da Sagrada Constituição, dos Artigos Comuns e da
            jurisprudência consolidada do Estado.
          </p>
          <a className="constitution-link" href="#biblioteca">
            <BookOpenText size={19} />
            Consultar Biblioteca Constitucional
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
