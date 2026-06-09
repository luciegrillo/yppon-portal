import { createDatabaseClient } from './client.js';
import {
  institutions,
  iugyAcademicFormations,
  iugyCalendarEvents,
  iugyNotices,
  iugySelectionCycles,
  officialDocuments,
} from './schema.js';

const publishedAt = new Date('1988-02-01T00:00:00.000Z');

const ids = {
  cycles: {
    current: '00000000-0000-4000-8000-000000001988',
    next: '00000000-0000-4000-8000-000000001989',
  },
  documents: {
    academicActs: '00000000-0000-4000-8000-000000004004',
    academicRegiment: '00000000-0000-4000-8000-000000004001',
    formationCatalog: '00000000-0000-4000-8000-000000004003',
    studentManual: '00000000-0000-4000-8000-000000004002',
  },
  formations: {
    eminent: '00000000-0000-4000-8000-000000002004',
    magistral: '00000000-0000-4000-8000-000000002003',
    superior: '00000000-0000-4000-8000-000000002002',
    technical: '00000000-0000-4000-8000-000000002001',
  },
  institution: '00000000-0000-4000-8000-000000000001',
  notices: {
    currentMagistral: '00000000-0000-4000-8000-000000003002',
    currentSuperior: '00000000-0000-4000-8000-000000003001',
    currentTechnical: '00000000-0000-4000-8000-000000003003',
    nextGeneral: '00000000-0000-4000-8000-000000003004',
  },
  events: {
    currentFirstPeriod: '00000000-0000-4000-8000-000000005001',
    currentSecondPeriod: '00000000-0000-4000-8000-000000005002',
    currentThirdPeriod: '00000000-0000-4000-8000-000000005003',
  },
};

const { client, db } = createDatabaseClient({ max: 1 });

try {
  await db.transaction(async (tx) => {
    await tx
      .insert(institutions)
      .values({
        acronym: 'IUGY',
        description:
          'Universidade única do Estado de Yppon, responsável por formações públicas e produção acadêmica oficial.',
        id: ids.institution,
        name: 'Instituto Universitário Geral de Yppon',
        publicationState: 'published',
        publishedAt,
        slug: 'iugy',
      })
      .onConflictDoNothing({ target: institutions.id });

    await tx
      .insert(iugyAcademicFormations)
      .values([
        {
          description:
            'Formação estatal de base. Prepara cidadãos para o exercício técnico e administrativo nas instituições de Yppon.',
          displayOrder: 1,
          externalReference: 'Formação estatal fundamental',
          id: ids.formations.technical,
          institutionId: ids.institution,
          levelCode: 'I',
          publicationState: 'published',
          publishedAt,
          title: 'Nível Técnico',
        },
        {
          description:
            'Formação avançada voltada à produção aplicada, à coordenação e ao aprofundamento de uma área estatal.',
          displayOrder: 2,
          externalReference: 'Referência externa: mestrado',
          id: ids.formations.superior,
          institutionId: ids.institution,
          levelCode: 'II',
          publicationState: 'published',
          publishedAt,
          title: 'Nível Superior',
        },
        {
          description:
            'Investigação e produção acadêmica original. Formandos contribuem diretamente para o acervo científico, técnico e jurídico do Estado.',
          displayOrder: 3,
          externalReference: 'Referência externa: doutorado',
          id: ids.formations.magistral,
          institutionId: ids.institution,
          levelCode: 'III',
          publicationState: 'published',
          publishedAt,
          title: 'Nível Magistral',
        },
        {
          description:
            'Grau máximo de formação da IUGY, reservado à produção de conhecimento de alcance excepcional e reconhecido globalmente.',
          displayOrder: 4,
          externalReference: 'Superior ao doutorado',
          id: ids.formations.eminent,
          institutionId: ids.institution,
          levelCode: 'IV',
          publicationState: 'published',
          publishedAt,
          title: 'Nível Eminente',
        },
      ])
      .onConflictDoNothing({ target: iugyAcademicFormations.id });

    await tx
      .insert(iugySelectionCycles)
      .values([
        {
          cycleNumber: 1988,
          id: ids.cycles.current,
          institutionId: ids.institution,
          periodLabel: 'Ciclo 1988',
          publicationState: 'published',
          publishedAt,
          title: 'Ciclo 1988',
        },
        {
          cycleNumber: 1989,
          id: ids.cycles.next,
          institutionId: ids.institution,
          periodLabel: 'Ciclo 1989',
          publicationState: 'published',
          publishedAt,
          title: 'Ciclo 1989',
        },
      ])
      .onConflictDoNothing({ target: iugySelectionCycles.id });

    await tx
      .insert(iugyNotices)
      .values([
        {
          code: 'IUGY-1988/003',
          formationId: ids.formations.technical,
          id: ids.notices.currentTechnical,
          institutionId: ids.institution,
          levelLabel: 'Nível Técnico',
          periodLabel: 'Ciclo 1988 · Período II',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.current,
          status: 'aberto',
          title: 'Admissão Geral ao Nível Técnico',
        },
        {
          code: 'IUGY-1988/002',
          formationId: ids.formations.magistral,
          id: ids.notices.currentMagistral,
          institutionId: ids.institution,
          levelLabel: 'Nível Magistral',
          periodLabel: 'Ciclo 1988 · Período II',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.current,
          status: 'aberto',
          title: 'Processo Seletivo — Magistral em Jurisprudência Aplicada',
        },
        {
          code: 'IUGY-1988/001',
          formationId: ids.formations.superior,
          id: ids.notices.currentSuperior,
          institutionId: ids.institution,
          levelLabel: 'Nível Superior',
          periodLabel: 'Ciclo 1988 · Período I',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.current,
          status: 'encerrado',
          title: 'Vagas Remanescentes — Superior em Administração Estatal',
        },
        {
          code: 'IUGY-1989/001',
          formationId: null,
          id: ids.notices.nextGeneral,
          institutionId: ids.institution,
          levelLabel: 'Todos os níveis',
          periodLabel: 'Ciclo 1989 · Período I',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.next,
          status: 'previsto',
          title: 'Admissão Geral — Ciclo 1989',
        },
      ])
      .onConflictDoNothing({ target: iugyNotices.id });

    await tx
      .insert(iugyCalendarEvents)
      .values([
        {
          description: 'Início das atividades letivas, recepção e primeiros módulos.',
          displayOrder: 1,
          id: ids.events.currentFirstPeriod,
          institutionId: ids.institution,
          periodLabel: 'Ciclo 1988 · Período I',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.current,
          title: 'Abertura e formação fundamental',
        },
        {
          description: 'Produção aplicada, avaliações regulamentares e novos editais.',
          displayOrder: 2,
          id: ids.events.currentSecondPeriod,
          institutionId: ids.institution,
          periodLabel: 'Ciclo 1988 · Período II',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.current,
          title: 'Desenvolvimento e avaliações',
        },
        {
          description: 'Avaliações finais, defesas acadêmicas e encerramento do ciclo.',
          displayOrder: 3,
          id: ids.events.currentThirdPeriod,
          institutionId: ids.institution,
          periodLabel: 'Ciclo 1988 · Período III',
          publicationState: 'published',
          publishedAt,
          selectionCycleId: ids.cycles.current,
          title: 'Conclusões e defesas',
        },
      ])
      .onConflictDoNothing({ target: iugyCalendarEvents.id });

    await tx
      .insert(officialDocuments)
      .values([
        {
          description: 'Normas, direitos e deveres do corpo discente e docente',
          id: ids.documents.academicRegiment,
          institutionId: ids.institution,
          publicationState: 'published',
          publishedAt,
          slug: 'regimento-academico',
          status: 'preparacao',
          title: 'Regimento Acadêmico',
        },
        {
          description: 'Orientações práticas para o ingresso e permanência na IUGY',
          id: ids.documents.studentManual,
          institutionId: ids.institution,
          publicationState: 'published',
          publishedAt,
          slug: 'manual-do-estudante',
          status: 'preparacao',
          title: 'Manual do Estudante',
        },
        {
          description: 'Descrição completa dos cursos e habilitações por nível',
          id: ids.documents.formationCatalog,
          institutionId: ids.institution,
          publicationState: 'published',
          publishedAt,
          slug: 'catalogo-de-formacoes',
          status: 'preparacao',
          title: 'Catálogo de Formações',
        },
        {
          description: 'Deliberações institucionais publicadas no Diário Oficial',
          id: ids.documents.academicActs,
          institutionId: ids.institution,
          publicationState: 'published',
          publishedAt,
          slug: 'atos-academicos-da-iugy',
          status: 'preparacao',
          title: 'Atos Acadêmicos da IUGY',
        },
      ])
      .onConflictDoNothing({ target: officialDocuments.id });
  });

  console.log('IUGY public development seed applied.');
} finally {
  await client.end();
}
