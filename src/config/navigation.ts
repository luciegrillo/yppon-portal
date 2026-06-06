export type NavigationItem = {
  label: string;
  href: string;
  number: string;
};

export const primaryNavigation: NavigationItem[] = [
  { label: 'Instituições', href: '#instituicoes', number: '01' },
  { label: 'Serviços', href: '#servicos', number: '02' },
  { label: 'Diário Oficial', href: '#diario-oficial', number: '03' },
  { label: 'Constituição', href: '#constituicao', number: '04' },
];
