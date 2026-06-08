import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ypponIconUrl from '../../assets/yppon-icon-transparent.webp';

export function NotFoundPage() {
  return (
    <main className="not-found" id="main-content" tabIndex={-1}>
      <div className="not-found__emblem" aria-hidden="true">
        <img src={ypponIconUrl} alt="" />
      </div>

      <div className="not-found__content">
        <p className="eyebrow">Registro não localizado · 404</p>
        <h1>
          Esta rota não consta
          <br />
          <em>nos arquivos.</em>
        </h1>
        <p>O endereço solicitado não foi reconhecido pelo Portal Oficial de Yppon.</p>
        <Link to="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Retornar ao portal
        </Link>
      </div>
    </main>
  );
}
