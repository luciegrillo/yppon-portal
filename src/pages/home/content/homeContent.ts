import {
  GraduationCap,
  Landmark,
  Orbit,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export type Institution = {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
  visualVariant: string;
};

export type PublicAccessLink = {
  title: string;
  description: string;
  href: string;
  id?: string;
};

export const institutions: Institution[] = [
  {
    number: 'I',
    title: 'Instituto Universitário',
    shortTitle: 'IUGY',
    description: 'Formação estatal, editais acadêmicos e a Seleção Decenal.',
    href: '#iugy',
    label: 'Conhecimento',
    icon: GraduationCap,
    visualVariant: 'academy',
  },
  {
    number: 'II',
    title: 'Poder Judiciário',
    shortTitle: 'Justiça',
    description: 'Jurisprudência, atos judiciais e designações dos tribunais.',
    href: '#judiciario',
    label: 'Equilíbrio',
    icon: Scale,
    visualVariant: 'justice',
  },
  {
    number: 'III',
    title: 'Poder Legislativo',
    shortTitle: 'Senado',
    description: 'Agenda dos 42 senadores, Artigos Comuns e sessões distritais.',
    href: '#legislativo',
    label: 'Representação',
    icon: Landmark,
    visualVariant: 'senate',
  },
  {
    number: 'IV',
    title: 'Comissão Global de Segurança',
    shortTitle: 'Segurança',
    description: 'Defesa civil, operações públicas e códigos disciplinares.',
    href: '#seguranca',
    label: 'Proteção',
    icon: ShieldCheck,
    visualVariant: 'security',
  },
  {
    number: 'V',
    title: 'Comissão Global de Migração',
    shortTitle: 'Migração',
    description: 'Autorizações, triagem e acesso planetário em Shelly.',
    href: '#migracao',
    label: 'Fronteiras',
    icon: Orbit,
    visualVariant: 'migration',
  },
];

export const publicAccessLinks: PublicAccessLink[] = [
  {
    title: 'Transparência',
    description: 'Dados, receitas e decisões públicas',
    href: '#transparencia',
  },
  {
    title: 'Diário Oficial',
    description: 'Atos e comunicados do ciclo vigente',
    href: '#diario-oficial',
  },
  {
    title: 'Ouvidoria',
    description: 'Canal direto com a administração',
    href: '#ouvidoria',
  },
  {
    title: 'Acesso Cidadão',
    description: 'Serviços e documentos pessoais',
    href: '#acesso-cidadao',
    id: 'acesso-cidadao',
  },
];
