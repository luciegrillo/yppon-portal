import {
  BookOpen,
  Crown,
  GraduationCap,
  Microscope,
  type LucideIcon,
} from 'lucide-react';
import { CURRENT_CYCLE } from '../../../config/portal';

export type AcademicLevel = {
  number: string;
  title: string;
  externalReference: string;
  description: string;
  icon: LucideIcon;
};

export type AcademicNotice = {
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
  status: 'preparacao';
};

export const academicLevels: AcademicLevel[] = [
  {
    number: 'I',
    title: 'Nível Técnico',
    externalReference: 'Próximo à graduação',
    description:
      'Formação estatal de base. Prepara cidadãos para o exercício técnico e ' +
      'administrativo nas instituições de Yppon.',
    icon: BookOpen,
  },
  {
    number: 'II',
    title: 'Nível Superior',
    externalReference: 'Próximo ao mestrado',
    description:
      'Formação avançada voltada à produção aplicada, à coordenação e ao ' +
      'aprofundamento de uma área estatal.',
    icon: GraduationCap,
  },
  {
    number: 'III',
    title: 'Nível Magistral',
    externalReference: 'Próximo ao doutorado',
    description:
      'Investigação e produção acadêmica original. Formandos contribuem ' +
      'diretamente para o acervo científico, técnico e jurídico do Estado.',
    icon: Microscope,
  },
  {
    number: 'IV',
    title: 'Nível Eminente',
    externalReference: 'Além do doutorado',
    description:
      'Grau máximo de formação da IUGY, reservado à produção de conhecimento ' +
      'de alcance excepcional e reconhecido globalmente.',
    icon: Crown,
  },
];

/** Conteúdo provisório — não representa editais oficiais. */
export const academicNotices: AcademicNotice[] = [
  {
    code: `IUGY-${CURRENT_CYCLE}/003`,
    title: 'Admissão Geral ao Nível Técnico',
    status: 'aberto',
    level: 'Nível Técnico',
    date: `Ciclo ${CURRENT_CYCLE} · Período II`,
  },
  {
    code: `IUGY-${CURRENT_CYCLE}/002`,
    title: 'Processo Seletivo — Magistral em Jurisprudência Aplicada',
    status: 'aberto',
    level: 'Nível Magistral',
    date: `Ciclo ${CURRENT_CYCLE} · Período II`,
  },
  {
    code: `IUGY-${CURRENT_CYCLE}/001`,
    title: 'Vagas Remanescentes — Superior em Administração Estatal',
    status: 'encerrado',
    level: 'Nível Superior',
    date: `Ciclo ${CURRENT_CYCLE} · Período I`,
  },
  {
    code: `IUGY-${CURRENT_CYCLE + 1}/001`,
    title: `Admissão Geral — Ciclo ${CURRENT_CYCLE + 1}`,
    status: 'previsto',
    level: 'Todos os níveis',
    date: `Ciclo ${CURRENT_CYCLE + 1} · Período I`,
  },
];

/** Conteúdo provisório — não representa o calendário oficial. */
export const calendarEvents: CalendarEvent[] = [
  {
    period: `Ciclo ${CURRENT_CYCLE} · Período I`,
    title: 'Abertura e formação fundamental',
    description: 'Início das atividades letivas, recepção e primeiros módulos.',
  },
  {
    period: `Ciclo ${CURRENT_CYCLE} · Período II`,
    title: 'Desenvolvimento e avaliações',
    description: 'Produção aplicada, avaliações regulamentares e novos editais.',
  },
  {
    period: `Ciclo ${CURRENT_CYCLE} · Período III`,
    title: 'Conclusões e defesas',
    description: 'Avaliações finais, defesas acadêmicas e encerramento do ciclo.',
  },
];

export const officialDocuments: OfficialDocument[] = [
  {
    title: 'Regimento Acadêmico',
    description: 'Normas, direitos e deveres do corpo discente e docente',
    status: 'preparacao',
  },
  {
    title: 'Manual do Estudante',
    description: 'Orientações práticas para o ingresso e permanência na IUGY',
    status: 'preparacao',
  },
  {
    title: 'Catálogo de Formações',
    description: 'Descrição completa dos cursos e habilitações por nível',
    status: 'preparacao',
  },
  {
    title: 'Atos Acadêmicos da IUGY',
    description: 'Deliberações institucionais publicadas no Diário Oficial',
    status: 'preparacao',
  },
];
