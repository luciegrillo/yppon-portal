import { ArrowUpRight } from 'lucide-react';
import ypponIconUrl from '../../assets/yppon-icon-transparent.webp';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-primary">
        <a className="footer-brand" href="#inicio">
          <img src={ypponIconUrl} alt="" aria-hidden="true" />
          <span>
            <strong>Estado de Yppon</strong>
            <small>Portal Oficial de Acesso Integrado</small>
          </span>
        </a>

        <p>
          Mantido sob a égide dos Artigos Comuns
          <br />
          da Sagrada Constituição.
        </p>

        <a className="back-to-top" href="#inicio">
          Retornar ao topo
          <ArrowUpRight size={17} />
        </a>
      </div>

      <div className="footer-bottom">
        <span>© Ciclo 1988 · Estado de Yppon</span>
        <span>Meritocracia Bipartite</span>
      </div>
    </footer>
  );
}
