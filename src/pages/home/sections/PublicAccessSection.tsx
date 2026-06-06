import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { gsap } from '../../../lib/animation';
import { publicAccessLinks } from '../content/homeContent';

type PublicAccessSectionProps = {
  prefersReducedMotion: boolean;
};

export function PublicAccessSection({ prefersReducedMotion }: PublicAccessSectionProps) {
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
          '.public-access__heading > *',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
        )
        .fromTo(
          '.public-links > a',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
          '-=0.4',
        );

      const links = gsap.utils.toArray<HTMLAnchorElement>('.public-links > a');
      links.forEach((link) => {
        const icon = link.querySelector('svg');
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
    <section className="public-access" id="servicos" ref={sectionRef}>
      <div className="public-access__heading">
        <Sparkles size={19} aria-hidden="true" />
        <p>Acesso público</p>
        <h2>
          O Estado,
          <br />
          ao seu alcance.
        </h2>
      </div>

      <div className="public-links">
        {publicAccessLinks.map((link, index) => (
          <a href={link.href} key={link.title} id={link.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{link.title}</strong>
              <p>{link.description}</p>
            </div>
            <ArrowUpRight size={21} />
          </a>
        ))}
      </div>
    </section>
  );
}
