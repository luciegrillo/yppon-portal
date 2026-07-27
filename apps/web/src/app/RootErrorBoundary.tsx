import { useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export function RootErrorBoundary() {
  const fallbackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fallbackRef.current?.focus();
  }, []);

  return (
    <main className="fatal-error" id="main-content" ref={fallbackRef} tabIndex={-1}>
      <div className="fatal-error__content" role="alert">
        <p className="eyebrow">Interrupção no portal</p>
        <h1>
          Não foi possível abrir
          <br />
          <em>esta página.</em>
        </h1>
        <p>
          O Portal Oficial encontrou uma falha inesperada. Nenhuma ação foi concluída;
          tente recarregar a página ou retorne ao início.
        </p>

        <div className="fatal-error__actions">
          <button type="button" onClick={() => window.location.reload()}>
            <RotateCcw size={17} aria-hidden="true" />
            Tentar novamente
          </button>
          <a href="/">
            <ArrowLeft size={17} aria-hidden="true" />
            Retornar ao portal
          </a>
        </div>
      </div>
    </main>
  );
}
