import { ArrowUpRight, Sparkles } from 'lucide-react';
import { publicAccessLinks } from '../content/homeContent';

export function PublicAccessSection() {
  return (
    <section className="public-access" id="servicos">
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
