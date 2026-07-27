export type OfficialDocument = {
  title: string;
  description: string;
  status: 'preparacao';
};

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
