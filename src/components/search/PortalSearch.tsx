import { type FormEvent } from 'react';
import { ArrowRight, Search } from 'lucide-react';

export function PortalSearch() {
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="portal-search" role="search" onSubmit={handleSearch}>
      <Search size={19} aria-hidden="true" />
      <label className="sr-only" htmlFor="portal-search">
        Buscar no portal
      </label>
      <input
        id="portal-search"
        type="search"
        placeholder="Busque um órgão, norma ou serviço"
      />
      <button type="submit" aria-label="Realizar busca">
        <ArrowRight size={20} />
      </button>
    </form>
  );
}
