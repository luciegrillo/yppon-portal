import { and, asc, count, desc, eq } from 'drizzle-orm';
import type { Database } from '../../db/client.js';
import {
  institutions,
  iugyAcademicFormations,
  iugyCalendarEvents,
  iugyNotices,
  iugySelectionCycles,
} from '../../db/schema.js';

export type IugyProgramSort = 'displayOrder' | 'publishedAt' | 'title';
export type IugyNoticeSort = 'code' | 'publishedAt' | 'status' | 'title';
export type IugyEventSort = 'displayOrder' | 'publishedAt' | 'title';

export type RepositoryPageOptions<TSort extends string> = {
  limit: number;
  offset: number;
  order: 'asc' | 'desc';
  sort: TSort;
};

export type IugyEventPageOptions = RepositoryPageOptions<IugyEventSort> & {
  currentOnly: boolean;
};

export type RepositoryPage<T> = {
  items: T[];
  totalItems: number;
};

export type IugyInstitutionRecord = {
  acronym: string;
  description: string;
  id: string;
  name: string;
  publishedAt: Date;
  slug: string;
};

export type IugyProgramRecord = {
  description: string;
  displayOrder: number;
  externalReference: string;
  id: string;
  levelCode: string;
  publishedAt: Date;
  title: string;
};

export type IugyNoticeRecord = {
  code: string;
  formationId: string | null;
  id: string;
  levelLabel: string;
  periodLabel: string;
  publishedAt: Date;
  selectionCycleId: string;
  status: 'aberto' | 'encerrado' | 'previsto';
  title: string;
};

export type IugySelectionCycleRecord = {
  cycleNumber: number;
  id: string;
  periodLabel: string;
  publishedAt: Date;
  title: string;
};

export type IugyCalendarEventRecord = {
  description: string;
  displayOrder: number;
  id: string;
  periodLabel: string;
  publishedAt: Date;
  selectionCycleId: string;
  title: string;
};

export type IugyRepository = {
  findInstitution(): Promise<IugyInstitutionRecord | null>;
  findCurrentSelectionCycle(): Promise<IugySelectionCycleRecord | null>;
  listEvents(
    options: IugyEventPageOptions,
  ): Promise<RepositoryPage<IugyCalendarEventRecord>>;
  listNotices(
    options: RepositoryPageOptions<IugyNoticeSort>,
  ): Promise<RepositoryPage<IugyNoticeRecord>>;
  listPrograms(
    options: RepositoryPageOptions<IugyProgramSort>,
  ): Promise<RepositoryPage<IugyProgramRecord>>;
};

type PostgresIugyRepositoryOptions = {
  institutionSlug?: string;
};

export function createPostgresIugyRepository(
  db: Database,
  { institutionSlug = 'iugy' }: PostgresIugyRepositoryOptions = {},
): IugyRepository {
  const publishedInstitution = and(
    eq(institutions.slug, institutionSlug),
    eq(institutions.publicationState, 'published'),
  );

  return {
    async findCurrentSelectionCycle() {
      const [row] = await db
        .select({
          cycleNumber: iugySelectionCycles.cycleNumber,
          id: iugySelectionCycles.id,
          periodLabel: iugySelectionCycles.periodLabel,
          publishedAt: iugySelectionCycles.publishedAt,
          title: iugySelectionCycles.title,
        })
        .from(iugySelectionCycles)
        .innerJoin(institutions, eq(iugySelectionCycles.institutionId, institutions.id))
        .where(
          and(
            publishedInstitution,
            eq(iugySelectionCycles.isCurrent, true),
            eq(iugySelectionCycles.publicationState, 'published'),
          ),
        )
        .limit(1);

      return row
        ? {
            ...row,
            publishedAt: requirePublishedAt(row.publishedAt),
          }
        : null;
    },

    async findInstitution() {
      const [row] = await db
        .select({
          acronym: institutions.acronym,
          description: institutions.description,
          id: institutions.id,
          name: institutions.name,
          publishedAt: institutions.publishedAt,
          slug: institutions.slug,
        })
        .from(institutions)
        .where(publishedInstitution)
        .limit(1);

      return row
        ? {
            ...row,
            publishedAt: requirePublishedAt(row.publishedAt),
          }
        : null;
    },

    async listEvents(options) {
      const where = and(
        publishedInstitution,
        eq(iugyCalendarEvents.publicationState, 'published'),
        options.currentOnly
          ? and(
              eq(iugySelectionCycles.isCurrent, true),
              eq(iugySelectionCycles.publicationState, 'published'),
            )
          : undefined,
      );
      const sortColumn = {
        displayOrder: iugyCalendarEvents.displayOrder,
        publishedAt: iugyCalendarEvents.publishedAt,
        title: iugyCalendarEvents.title,
      }[options.sort];
      const orderBy = options.order === 'asc' ? asc : desc;

      return db.transaction(
        async (tx): Promise<RepositoryPage<IugyCalendarEventRecord>> => {
          const [totalRow] = await tx
            .select({ totalItems: count() })
            .from(iugyCalendarEvents)
            .innerJoin(
              institutions,
              eq(iugyCalendarEvents.institutionId, institutions.id),
            )
            .innerJoin(
              iugySelectionCycles,
              and(
                eq(iugyCalendarEvents.selectionCycleId, iugySelectionCycles.id),
                eq(iugyCalendarEvents.institutionId, iugySelectionCycles.institutionId),
              ),
            )
            .where(where);

          const rows = await tx
            .select({
              description: iugyCalendarEvents.description,
              displayOrder: iugyCalendarEvents.displayOrder,
              id: iugyCalendarEvents.id,
              periodLabel: iugyCalendarEvents.periodLabel,
              publishedAt: iugyCalendarEvents.publishedAt,
              selectionCycleId: iugyCalendarEvents.selectionCycleId,
              title: iugyCalendarEvents.title,
            })
            .from(iugyCalendarEvents)
            .innerJoin(
              institutions,
              eq(iugyCalendarEvents.institutionId, institutions.id),
            )
            .innerJoin(
              iugySelectionCycles,
              and(
                eq(iugyCalendarEvents.selectionCycleId, iugySelectionCycles.id),
                eq(iugyCalendarEvents.institutionId, iugySelectionCycles.institutionId),
              ),
            )
            .where(where)
            .orderBy(orderBy(sortColumn), asc(iugyCalendarEvents.id))
            .limit(options.limit)
            .offset(options.offset);

          return {
            items: rows.map((row) => ({
              ...row,
              publishedAt: requirePublishedAt(row.publishedAt),
            })),
            totalItems: totalRow?.totalItems ?? 0,
          };
        },
        { accessMode: 'read only', isolationLevel: 'repeatable read' },
      );
    },

    async listNotices(options) {
      const where = and(
        publishedInstitution,
        eq(iugyNotices.publicationState, 'published'),
      );
      const sortColumn = {
        code: iugyNotices.code,
        publishedAt: iugyNotices.publishedAt,
        status: iugyNotices.status,
        title: iugyNotices.title,
      }[options.sort];
      const orderBy = options.order === 'asc' ? asc : desc;

      return db.transaction(
        async (tx): Promise<RepositoryPage<IugyNoticeRecord>> => {
          const [totalRow] = await tx
            .select({ totalItems: count() })
            .from(iugyNotices)
            .innerJoin(institutions, eq(iugyNotices.institutionId, institutions.id))
            .where(where);

          const rows = await tx
            .select({
              code: iugyNotices.code,
              formationId: iugyNotices.formationId,
              id: iugyNotices.id,
              levelLabel: iugyNotices.levelLabel,
              periodLabel: iugyNotices.periodLabel,
              publishedAt: iugyNotices.publishedAt,
              selectionCycleId: iugyNotices.selectionCycleId,
              status: iugyNotices.status,
              title: iugyNotices.title,
            })
            .from(iugyNotices)
            .innerJoin(institutions, eq(iugyNotices.institutionId, institutions.id))
            .where(where)
            .orderBy(orderBy(sortColumn), asc(iugyNotices.id))
            .limit(options.limit)
            .offset(options.offset);

          return {
            items: rows.map((row) => ({
              ...row,
              publishedAt: requirePublishedAt(row.publishedAt),
            })),
            totalItems: totalRow?.totalItems ?? 0,
          };
        },
        { accessMode: 'read only', isolationLevel: 'repeatable read' },
      );
    },

    async listPrograms(options) {
      const where = and(
        publishedInstitution,
        eq(iugyAcademicFormations.publicationState, 'published'),
      );
      const sortColumn = {
        displayOrder: iugyAcademicFormations.displayOrder,
        publishedAt: iugyAcademicFormations.publishedAt,
        title: iugyAcademicFormations.title,
      }[options.sort];
      const orderBy = options.order === 'asc' ? asc : desc;

      return db.transaction(
        async (tx): Promise<RepositoryPage<IugyProgramRecord>> => {
          const [totalRow] = await tx
            .select({ totalItems: count() })
            .from(iugyAcademicFormations)
            .innerJoin(
              institutions,
              eq(iugyAcademicFormations.institutionId, institutions.id),
            )
            .where(where);

          const rows = await tx
            .select({
              description: iugyAcademicFormations.description,
              displayOrder: iugyAcademicFormations.displayOrder,
              externalReference: iugyAcademicFormations.externalReference,
              id: iugyAcademicFormations.id,
              levelCode: iugyAcademicFormations.levelCode,
              publishedAt: iugyAcademicFormations.publishedAt,
              title: iugyAcademicFormations.title,
            })
            .from(iugyAcademicFormations)
            .innerJoin(
              institutions,
              eq(iugyAcademicFormations.institutionId, institutions.id),
            )
            .where(where)
            .orderBy(orderBy(sortColumn), asc(iugyAcademicFormations.id))
            .limit(options.limit)
            .offset(options.offset);

          return {
            items: rows.map((row) => ({
              ...row,
              publishedAt: requirePublishedAt(row.publishedAt),
            })),
            totalItems: totalRow?.totalItems ?? 0,
          };
        },
        { accessMode: 'read only', isolationLevel: 'repeatable read' },
      );
    },
  };
}

function requirePublishedAt(value: Date | null): Date {
  if (!value) {
    throw new Error('Published IUGY content is missing published_at');
  }

  return value;
}
