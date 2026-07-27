import type {
  IugyCalendarEvent,
  IugyEventsQuery,
  IugyEventsResponse,
  IugyInstitution,
  IugyInstitutionResponse,
  IugyNotice,
  IugyNoticesQuery,
  IugyNoticesResponse,
  IugyProgram,
  IugyProgramsQuery,
  IugyProgramsResponse,
  IugySelectionCycle,
  IugySelectionCycleResponse,
} from './iugy.contracts.js';
import type {
  IugyCalendarEventRecord,
  IugyInstitutionRecord,
  IugyNoticeRecord,
  IugyProgramRecord,
  IugyRepository,
  IugySelectionCycleRecord,
  RepositoryPageOptions,
} from './iugy.repository.js';

export type IugyService = {
  getCurrentSelectionCycle(): Promise<IugySelectionCycleResponse | null>;
  getInstitution(): Promise<IugyInstitutionResponse | null>;
  listEvents(query: IugyEventsQuery): Promise<IugyEventsResponse>;
  listNotices(query: IugyNoticesQuery): Promise<IugyNoticesResponse>;
  listPrograms(query: IugyProgramsQuery): Promise<IugyProgramsResponse>;
};

export function createIugyService(repository: IugyRepository): IugyService {
  return {
    async getCurrentSelectionCycle() {
      const cycle = await repository.findCurrentSelectionCycle();

      return cycle ? { data: toSelectionCycle(cycle) } : null;
    },

    async getInstitution() {
      const institution = await repository.findInstitution();

      return institution ? { data: toInstitution(institution) } : null;
    },

    async listEvents(query) {
      const page = toRepositoryPage(query, {
        order: 'asc',
        sort: 'displayOrder',
      });
      const result = await repository.listEvents(page.options);

      return {
        data: result.items.map(toCalendarEvent),
        pagination: pagination(page.page, page.pageSize, result.totalItems),
      };
    },

    async listNotices(query) {
      const page = toRepositoryPage(query, {
        order: 'desc',
        sort: 'publishedAt',
      });
      const result = await repository.listNotices(page.options);

      return {
        data: result.items.map(toNotice),
        pagination: pagination(page.page, page.pageSize, result.totalItems),
      };
    },

    async listPrograms(query) {
      const page = toRepositoryPage(query, {
        order: 'asc',
        sort: 'displayOrder',
      });
      const result = await repository.listPrograms(page.options);

      return {
        data: result.items.map(toProgram),
        pagination: pagination(page.page, page.pageSize, result.totalItems),
      };
    },
  };
}

function toRepositoryPage<TSort extends string>(
  query: {
    order?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    sort?: TSort;
  },
  defaults: {
    order: 'asc' | 'desc';
    sort: TSort;
  },
) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;

  return {
    options: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: query.order ?? defaults.order,
      sort: query.sort ?? defaults.sort,
    } satisfies RepositoryPageOptions<TSort>,
    page,
    pageSize,
  };
}

function pagination(page: number, pageSize: number, totalItems: number) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  };
}

function toInstitution(record: IugyInstitutionRecord): IugyInstitution {
  return {
    acronym: record.acronym,
    description: record.description,
    id: record.id,
    name: record.name,
    publishedAt: record.publishedAt.toISOString(),
    slug: record.slug,
  };
}

function toProgram(record: IugyProgramRecord): IugyProgram {
  return {
    description: record.description,
    displayOrder: record.displayOrder,
    externalReference: record.externalReference,
    id: record.id,
    levelCode: record.levelCode,
    publishedAt: record.publishedAt.toISOString(),
    title: record.title,
  };
}

function toNotice(record: IugyNoticeRecord): IugyNotice {
  return {
    code: record.code,
    formationId: record.formationId,
    id: record.id,
    levelLabel: record.levelLabel,
    periodLabel: record.periodLabel,
    publishedAt: record.publishedAt.toISOString(),
    selectionCycleId: record.selectionCycleId,
    status: record.status,
    title: record.title,
  };
}

function toSelectionCycle(record: IugySelectionCycleRecord): IugySelectionCycle {
  return {
    cycleNumber: record.cycleNumber,
    id: record.id,
    periodLabel: record.periodLabel,
    publishedAt: record.publishedAt.toISOString(),
    title: record.title,
  };
}

function toCalendarEvent(record: IugyCalendarEventRecord): IugyCalendarEvent {
  return {
    description: record.description,
    displayOrder: record.displayOrder,
    id: record.id,
    periodLabel: record.periodLabel,
    publishedAt: record.publishedAt.toISOString(),
    selectionCycleId: record.selectionCycleId,
    title: record.title,
  };
}
