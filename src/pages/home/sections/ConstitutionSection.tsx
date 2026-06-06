import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, BookOpenText } from 'lucide-react';
import { gsap } from '../../../lib/animation';

type ConstitutionSectionProps = {
  prefersReducedMotion: boolean;
};

function ConstitutionEmblem() {
  return (
    <svg className="emblem-graphic" viewBox="0 0 680 680" aria-hidden="true">
      <g className="emblem-orbits">
        <path d="M145 390C95 245 177 101 323 76" />
        <path d="M535 390C585 245 503 101 357 76" />
      </g>
      <g className="emblem-star">
        <path d="M340 48L353 78L385 74L363 98L380 126L347 115L326 141L325 107L293 95L324 82Z" />
      </g>
      <g className="emblem-axe">
        <path d="M336 183V536" />
        <path d="M322 181L340 153L358 181L348 204H332Z" />
        <path d="M336 236C285 188 237 205 215 247C239 253 256 277 257 307C292 306 317 287 336 262" />
        <path d="M340 236C391 188 439 205 461 247C437 253 420 277 419 307C384 306 359 287 340 262" />
        <path d="M324 536L340 562L356 536" />
      </g>
      <g className="emblem-bolts">
        <path d="M211 352L158 430L206 421L168 515L269 397L219 408L250 352" />
        <path d="M465 352L518 430L470 421L508 515L407 397L457 408L426 352" />
      </g>
      <circle cx="340" cy="597" r="9" />
    </svg>
  );
}

export function ConstitutionSection({ prefersReducedMotion }: ConstitutionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return undefined;

    const animationContext = gsap.context(() => {
      const emblemPaths =
        sectionRef.current?.querySelectorAll<SVGPathElement>('.emblem-graphic path');

      gsap.fromTo(
        emblemPaths ?? [],
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            end: 'center 52%',
            scrub: 0.8,
          },
        },
      );

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
          <span>Lex supra omnia</span>
          <ConstitutionEmblem />
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
            A Sagrada Constituição estabelece o equilíbrio estrutural de Yppon. Consulte o
            documento integral, suas normativas e a jurisprudência consolidada.
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
