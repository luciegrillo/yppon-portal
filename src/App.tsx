import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Menu,
  Orbit,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ypponFlagUrl from './assets/yppon-flag.webp';
import ypponIconUrl from './assets/yppon-icon-transparent.webp';

const FlagScene = lazy(() => import('./FlagScene'));

gsap.registerPlugin(ScrollTrigger);

type Institution = {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
  variant: string;
};

const institutions: Institution[] = [
  {
    number: 'I',
    title: 'Instituto Universitário',
    shortTitle: 'IUGY',
    description: 'Formação estatal, editais acadêmicos e a Seleção Decenal.',
    href: '#iugy',
    label: 'Conhecimento',
    icon: GraduationCap,
    variant: 'academy',
  },
  {
    number: 'II',
    title: 'Poder Judiciário',
    shortTitle: 'Justiça',
    description: 'Jurisprudência, atos judiciais e designações dos tribunais.',
    href: '#judiciario',
    label: 'Equilíbrio',
    icon: Scale,
    variant: 'justice',
  },
  {
    number: 'III',
    title: 'Poder Legislativo',
    shortTitle: 'Senado',
    description: 'Agenda dos 42 senadores, Artigos Comuns e sessões distritais.',
    href: '#legislativo',
    label: 'Representação',
    icon: Landmark,
    variant: 'senate',
  },
  {
    number: 'IV',
    title: 'Comissão Global de Segurança',
    shortTitle: 'Segurança',
    description: 'Defesa civil, operações públicas e códigos disciplinares.',
    href: '#seguranca',
    label: 'Proteção',
    icon: ShieldCheck,
    variant: 'security',
  },
  {
    number: 'V',
    title: 'Comissão Global de Migração',
    shortTitle: 'Migração',
    description: 'Autorizações, triagem e acesso planetário em Shelly.',
    href: '#migracao',
    label: 'Fronteiras',
    icon: Orbit,
    variant: 'migration',
  },
];

const navigation = [
  { label: 'Órgãos', href: '#orgaos', number: '01' },
  { label: 'Serviços', href: '#servicos', number: '02' },
  { label: 'Diário Oficial', href: '#diario-oficial', number: '03' },
  { label: 'Constituição', href: '#constituicao', number: '04' },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext
      && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

function CeremonialMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.classList.add('menu-open');

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose, open]);

  return (
    <div
      className={`ceremonial-menu${open ? ' ceremonial-menu--open' : ''}`}
      aria-hidden={!open}
    >
      <button
        className="menu-backdrop"
        type="button"
        aria-label="Fechar navegação"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <div
        className="menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navegação principal"
      >
        <div className="menu-panel__top">
          <span className="menu-panel__edition">Portal Oficial · Ciclo 942</span>
          <button
            className="round-button round-button--light"
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="ceremonial-nav" aria-label="Navegação principal">
          {navigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              style={{ '--nav-delay': `${120 + index * 80}ms` } as React.CSSProperties}
            >
              <span>{item.number}</span>
              <strong>{item.label}</strong>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="menu-panel__footer">
          <a href="#acesso-cidadao" onClick={onClose} tabIndex={open ? 0 : -1}>
            <LockKeyhole size={16} />
            Acesso Cidadão
          </a>
          <p>Meritocracia Bipartite de Yppon</p>
        </div>
      </div>
    </div>
  );
}

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Yppon, página inicial">
          <img src={ypponIconUrl} alt="" aria-hidden="true" />
          <span>
            <strong>Yppon</strong>
            <small>Portal Oficial</small>
          </span>
        </a>

        <div className="header-cycle" aria-hidden="true">
          <span>Meritocracia Bipartite</span>
          <i />
          <span>Ciclo 942</span>
        </div>

        <button
          className="menu-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="ceremonial-navigation"
          onClick={() => setMenuOpen(true)}
        >
          <span>Menu</span>
          <Menu size={21} aria-hidden="true" />
        </button>
      </header>
      <div id="ceremonial-navigation">
        <CeremonialMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </>
  );
}

function SearchPortal() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="portal-search" role="search" onSubmit={handleSubmit}>
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

function Hero({
  menuOpen,
  reducedMotion,
}: {
  menuOpen: boolean;
  reducedMotion: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => setWebgl(supportsWebGL()), []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setSceneVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || !heroRef.current) {
      progressRef.current = 0;
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      timeline
        .to('.flag-world', { scale: 0.76, yPercent: -8, duration: 0.62, ease: 'none' }, 0)
        .to('.hero-vignette', { opacity: 0.82, duration: 0.35, ease: 'none' }, 0.08)
        .to('.hero-copy', { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }, 0.18)
        .to('.hero-orbit', { rotate: 28, scale: 1.08, duration: 0.72, ease: 'none' }, 0)
        .to('.hero-copy', { opacity: 0, y: -38, duration: 0.24, ease: 'none' }, 0.76);
    }, heroRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <div className="hero-stage" ref={stageRef}>
        <div className="hero-vignette" />
        <div className="hero-grain" />
        <div className="hero-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="flag-world" aria-hidden="true">
          <img className="flag-fallback" src={ypponFlagUrl} alt="" />
          {webgl && (
            <Suspense fallback={null}>
              <FlagScene
                progressRef={progressRef}
                paused={menuOpen || !sceneVisible}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          )}
        </div>

        <div className="hero-intro" aria-hidden="true">
          <span>Estado de Yppon</span>
          <i />
          <span>Portal unificado</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Meritocracia Bipartite · Ciclo 942</p>
          <h1>Uma nação<br /><em>em movimento.</em></h1>
          <p className="hero-copy__lead">
            Acesso integrado às instituições que sustentam Yppon.
          </p>
          <SearchPortal />
        </div>

        <a className="scroll-cue" href="#orgaos">
          <span>Descobrir o Estado</span>
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function InstitutionVisual({
  institution,
}: {
  institution: Institution;
}) {
  const Icon = institution.icon;

  return (
    <div className={`institution-visual institution-visual--${institution.variant}`} aria-hidden="true">
      <div className="visual-grid" />
      <div className="visual-ring visual-ring--outer" />
      <div className="visual-ring visual-ring--inner" />
      <div className="visual-axis visual-axis--x" />
      <div className="visual-axis visual-axis--y" />
      <div className="visual-core">
        <Icon strokeWidth={1.15} />
      </div>
      <span className="visual-pulse visual-pulse--one" />
      <span className="visual-pulse visual-pulse--two" />
      <span className="visual-coordinate visual-coordinate--top">42° 11' YP</span>
      <span className="visual-coordinate visual-coordinate--bottom">{institution.label.toUpperCase()}</span>
    </div>
  );
}

function InstitutionPanel({
  institution,
  index,
  setRef,
}: {
  institution: Institution;
  index: number;
  setRef: (node: HTMLElement | null) => void;
}) {
  return (
    <article
      className="institution-panel"
      id={institution.href.slice(1)}
      ref={setRef}
      data-index={index}
    >
      <div className="institution-panel__copy">
        <span className="institution-panel__number">{institution.number.padStart(2, '0')}</span>
        <p className="institution-panel__label">{institution.label}</p>
        <h3>{institution.title}</h3>
        <p className="institution-panel__description">{institution.description}</p>
        <a href={institution.href}>
          Acessar instituição
          <ArrowUpRight size={18} />
        </a>
      </div>
      <InstitutionVisual institution={institution} />
    </article>
  );
}

function Institutions({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observers = panelsRef.current.map((panel, index) => {
      if (!panel) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { rootMargin: '-38% 0px -38% 0px', threshold: 0 },
      );
      observer.observe(panel);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return undefined;

    const context = gsap.context(() => {
      panelsRef.current.forEach((panel) => {
        if (!panel) return;
        gsap.fromTo(
          panel.querySelector('.institution-panel__copy'),
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 72%',
              end: 'top 42%',
              scrub: 0.5,
            },
          },
        );
      });
    }, sectionRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section className="institutions" id="orgaos" ref={sectionRef}>
      <div className="institutions-heading">
        <p className="eyebrow">Estruturas fundamentais</p>
        <h2>A arquitetura<br /><em>do Estado.</em></h2>
        <p>Cinco instituições. Um sistema público conectado.</p>
      </div>

      <div className="institutions-layout">
        <aside className="institution-index" aria-label="Instituições">
          <p>Órgãos centrais</p>
          <ol>
            {institutions.map((institution, index) => (
              <li className={activeIndex === index ? 'is-active' : ''} key={institution.shortTitle}>
                <a href={institution.href}>
                  <span>{institution.number}</span>
                  <strong>{institution.shortTitle}</strong>
                </a>
              </li>
            ))}
          </ol>
          <div className="index-progress">
            <span style={{ transform: `scaleY(${(activeIndex + 1) / institutions.length})` }} />
          </div>
        </aside>

        <div className="institution-panels">
          {institutions.map((institution, index) => (
            <InstitutionPanel
              institution={institution}
              index={index}
              key={institution.title}
              setRef={(node) => {
                panelsRef.current[index] = node;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EmblemGraphic() {
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

function Constitution({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return undefined;

    const context = gsap.context(() => {
      const paths = sectionRef.current?.querySelectorAll<SVGPathElement>('.emblem-graphic path');
      gsap.fromTo(
        paths ?? [],
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

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section className="constitution" id="constituicao" ref={sectionRef}>
      <div className="constitution-sun" aria-hidden="true" />
      <div className="constitution-grid">
        <div className="constitution-mark">
          <span>Lex supra omnia</span>
          <EmblemGraphic />
          <p>Sagrada Constituição · Arquivo Central</p>
        </div>
        <div className="constitution-copy">
          <p className="eyebrow">Fundamento constitucional</p>
          <h2>A lei é a única<br /><em>soberana.</em></h2>
          <p>
            A Sagrada Constituição estabelece o equilíbrio estrutural de Yppon.
            Consulte o documento integral, suas normativas e a jurisprudência consolidada.
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

function PublicAccess() {
  const links = [
    ['Transparência', 'Dados, receitas e decisões públicas'],
    ['Diário Oficial', 'Atos e comunicados do ciclo vigente'],
    ['Ouvidoria', 'Canal direto com a administração'],
    ['Acesso Cidadão', 'Serviços e documentos pessoais'],
  ];

  return (
    <section className="public-access" id="servicos">
      <div className="public-access__heading">
        <Sparkles size={19} aria-hidden="true" />
        <p>Acesso público</p>
        <h2>O Estado,<br />ao seu alcance.</h2>
      </div>
      <div className="public-links">
        {links.map(([title, description], index) => (
          <a
            href={index === 1 ? '#diario-oficial' : `#${title.toLowerCase().replace(/\s+/g, '-')}`}
            key={title}
            id={index === 3 ? 'acesso-cidadao' : undefined}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
            <ArrowUpRight size={21} />
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-primary">
        <a className="footer-brand" href="#inicio">
          <img src={ypponIconUrl} alt="" aria-hidden="true" />
          <span>
            <strong>Governo de Yppon</strong>
            <small>Portal Oficial de Acesso Integrado</small>
          </span>
        </a>
        <p>
          Mantido sob a égide dos Artigos Comuns<br />
          da Sagrada Constituição.
        </p>
        <a className="back-to-top" href="#inicio">
          Retornar ao topo
          <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© Ciclo 942 · Nação de Yppon</span>
        <span>Meritocracia Bipartite</span>
      </div>
    </footer>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      anchors: true,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [reducedMotion]);

  const swallowEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && menuOpen) setMenuOpen(false);
  };

  return (
    <div className="app" onKeyDown={swallowEscape}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="conteudo">
        <Hero menuOpen={menuOpen} reducedMotion={reducedMotion} />
        <Institutions reducedMotion={reducedMotion} />
        <Constitution reducedMotion={reducedMotion} />
        <PublicAccess />
      </main>
      <Footer />
    </div>
  );
}

export default App;
