export type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type ResourceResponse<T> = {
  data: T;
};

export type CollectionResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type IugyInstitution = {
  acronym: string;
  description: string;
  id: string;
  name: string;
  publishedAt: string;
  slug: string;
};

export type IugyInstitutionResponse = ResourceResponse<IugyInstitution>;

export type IugyProgram = {
  description: string;
  displayOrder: number;
  externalReference: string;
  id: string;
  levelCode: string;
  publishedAt: string;
  title: string;
};

export type IugyProgramsResponse = CollectionResponse<IugyProgram>;

export type IugyNoticeStatus = 'aberto' | 'encerrado' | 'previsto';

export type IugyNotice = {
  code: string;
  formationId: string | null;
  id: string;
  levelLabel: string;
  periodLabel: string;
  publishedAt: string;
  selectionCycleId: string;
  status: IugyNoticeStatus;
  title: string;
};

export type IugyNoticesResponse = CollectionResponse<IugyNotice>;

export type IugySelectionCycle = {
  cycleNumber: number;
  id: string;
  periodLabel: string;
  publishedAt: string;
  title: string;
};

export type IugySelectionCycleResponse = ResourceResponse<IugySelectionCycle>;

export type IugyCalendarEvent = {
  description: string;
  displayOrder: number;
  id: string;
  periodLabel: string;
  publishedAt: string;
  selectionCycleId: string;
  title: string;
};

export type IugyEventsResponse = CollectionResponse<IugyCalendarEvent>;
