import {
  BookOpen,
  Crown,
  GraduationCap,
  Microscope,
  type LucideIcon,
} from 'lucide-react';

export type AcademicLevel = {
  number: string;
  title: string;
  equivalent: string;
  description: string;
  duration: string;
  icon: LucideIcon;
};

export type Edital = {
  code: string;
  title: string;
  status: 'aberto' | 'encerrado' | 'previsto';
  level: string;
  date: string;
};

export type CalendarEvent = {
  period: string;
  title: string;
  description: string;
};

export type OfficialDocument = {
  title: string;
  description: string;
  href: string;
};

export const academicLevels: AcademicLevel[] = [
  {
    number: 'I',
    title: 'Nível Técnico',
    equivalent: 'Graduação',
    description:
      'Formação estatal de base. Prepara cidadãos para o exercício técnico e ' +
      'administrativo nas instituições de Yppon, com currículo regulado pelo ' +
      'Conselho Acadêmico.',
    duration: '4 ciclos',
    icon: BookOpen,
  },
  {
    number: 'II',
    title: 'Nível Superior',
    equivalent: 'Pós-Graduação',
    description:
      'Especialização avançada voltada à produção aplicada. Habilita o ' +
      'exercício de funções de coordenação, consultoria e docência no ' +
      'Nível Técnico.',
    duration: '2 ciclos',
    icon: GraduationCap,
  },
  {
    number: 'III',
    title: 'Nível Magistral',
    equivalent: 'Mestrado / Doutorado',
    description:
      'Investigação e produção acadêmica sob orientação do corpo magistral. ' +
      'Formandos contribuem diretamente para o acervo científico e jurídico ' +
      'do Estado.',
    duration: '3 ciclos',
    icon: Microscope,
  },
  {
    number: 'IV',
    title: 'Nível Eminente',
    equivalent: 'Distinção Vitalícia',
    description:
      'Distinção máxima concedida pelo Estado a acadêmicos de contribuição ' +
      'excepcional. A nomeação é deliberada pelo Conselho Eminente e ' +
      'ratificada pelo Senado.',
    duration: 'Vitalício',
    icon: Crown,
  },
];

/** Conteúdo provisório — não representa editais oficiais. */
export const edictals: Edital[] = [
  {
    code: 'IUGY-1988/003',
    title: 'Admissão Geral ao Nível Técnico',
    status: 'aberto',
    level: 'Nível Técnico',
    date: 'Ciclo 1988.2',
  },
  {
    code: 'IUGY-1988/002',
    title: 'Processo Seletivo — Magistral em Jurisprudência Aplicada',
    status: 'aberto',
    level: 'Nível Magistral',
    date: 'Ciclo 1988.2',
  },
  {
    code: 'IUGY-1988/001',
    title: 'Vagas Remanescentes — Superior em Administração Estatal',
    status: 'encerrado',
    level: 'Nível Superior',
    date: 'Ciclo 1988.1',
  },
  {
    code: 'IUGY-1989/001',
    title: 'Admissão Geral — Ciclo 1989',
    status: 'previsto',
    level: 'Todos os níveis',
    date: 'Ciclo 1989.1',
  },
];

/** Conteúdo provisório — não representa o calendário oficial. */
export const calendarEvents: CalendarEvent[] = [
  {
    period: '1988.1 — Fase I',
    title: 'Abertura do Ciclo Acadêmico',
    description: 'Início das atividades letivas e cerimônia de recepção.',
  },
  {
    period: '1988.1 — Fase II',
    title: 'Período de Avaliações Parciais',
    description: 'Provas regulamentares e entrega de projetos intermediários.',
  },
  {
    period: '1988.1 — Fase III',
    title: 'Recesso Interstitial',
    description: 'Pausa letiva entre as fases do ciclo.',
  },
  {
    period: '1988.2 — Fase I',
    title: 'Retomada e Novos Editais',
    description:
      'Início do segundo período, abertura de editais de admissão e transferência.',
  },
  {
    period: '1988.2 — Fase II',
    title: 'Avaliações Finais e Defesas',
    description:
      'Exames conclusivos para todos os níveis e defesas de projetos magistrais.',
  },
  {
    period: '1988.2 — Fase III',
    title: 'Encerramento do Ciclo',
    description: 'Cerimônia de conclusão e publicação dos resultados oficiais.',
  },
];

export const officialDocuments: OfficialDocument[] = [
  {
    title: 'Regimento Acadêmico',
    description: 'Normas, direitos e deveres do corpo discente e docente',
    href: '#regimento',
  },
  {
    title: 'Manual do Estudante',
    description: 'Orientações práticas para o ingresso e permanência na IUGY',
    href: '#manual',
  },
  {
    title: 'Catálogo de Formações',
    description: 'Descrição completa dos cursos e habilitações por nível',
    href: '#catalogo',
  },
  {
    title: 'Atos do Conselho Acadêmico',
    description: 'Deliberações publicadas no Diário Oficial do Estado',
    href: '#atos',
  },
];
