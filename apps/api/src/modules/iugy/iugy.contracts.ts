import { Type, type Static, type TObject, type TSchema } from '@sinclair/typebox';

const IdentifierSchema = Type.String({ format: 'uuid' });
const PublishedAtSchema = Type.String({ format: 'date-time' });
const MAX_PAGE = 10_000;

const PageSchema = Type.Optional(
  Type.Integer({
    default: 1,
    maximum: MAX_PAGE,
    minimum: 1,
  }),
);

const PageSizeSchema = Type.Optional(
  Type.Integer({
    default: 20,
    maximum: 100,
    minimum: 1,
  }),
);

export const SortOrderSchema = Type.Union([Type.Literal('asc'), Type.Literal('desc')]);

export const PaginationSchema = Type.Object({
  page: Type.Integer({ maximum: MAX_PAGE, minimum: 1 }),
  pageSize: Type.Integer({ maximum: 100, minimum: 1 }),
  totalItems: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
});

export const IugyInstitutionSchema = Type.Object({
  acronym: Type.String(),
  description: Type.String(),
  id: IdentifierSchema,
  name: Type.String(),
  publishedAt: PublishedAtSchema,
  slug: Type.String(),
});

export const IugyInstitutionResponseSchema = resourceResponse(IugyInstitutionSchema);

export const IugyProgramSchema = Type.Object({
  description: Type.String(),
  displayOrder: Type.Integer(),
  externalReference: Type.String(),
  id: IdentifierSchema,
  levelCode: Type.String(),
  publishedAt: PublishedAtSchema,
  title: Type.String(),
});

export const IugyProgramsQuerySchema = Type.Object(
  {
    order: Type.Optional(
      Type.Union([Type.Literal('asc'), Type.Literal('desc')], {
        default: 'asc',
      }),
    ),
    page: PageSchema,
    pageSize: PageSizeSchema,
    sort: Type.Optional(
      Type.Union(
        [
          Type.Literal('displayOrder'),
          Type.Literal('publishedAt'),
          Type.Literal('title'),
        ],
        { default: 'displayOrder' },
      ),
    ),
  },
  { additionalProperties: false },
);

export const IugyProgramsResponseSchema = collectionResponse(IugyProgramSchema);

export const IugyNoticeStatusSchema = Type.Union([
  Type.Literal('aberto'),
  Type.Literal('encerrado'),
  Type.Literal('previsto'),
]);

export const IugyNoticeSchema = Type.Object({
  code: Type.String(),
  formationId: Type.Union([IdentifierSchema, Type.Null()]),
  id: IdentifierSchema,
  levelLabel: Type.String(),
  periodLabel: Type.String(),
  publishedAt: PublishedAtSchema,
  selectionCycleId: IdentifierSchema,
  status: IugyNoticeStatusSchema,
  title: Type.String(),
});

export const IugyNoticesQuerySchema = Type.Object(
  {
    order: Type.Optional(
      Type.Union([Type.Literal('asc'), Type.Literal('desc')], {
        default: 'desc',
      }),
    ),
    page: PageSchema,
    pageSize: PageSizeSchema,
    sort: Type.Optional(
      Type.Union(
        [
          Type.Literal('code'),
          Type.Literal('publishedAt'),
          Type.Literal('status'),
          Type.Literal('title'),
        ],
        { default: 'publishedAt' },
      ),
    ),
  },
  { additionalProperties: false },
);

export const IugyNoticesResponseSchema = collectionResponse(IugyNoticeSchema);

export const IugySelectionCycleSchema = Type.Object({
  cycleNumber: Type.Integer(),
  id: IdentifierSchema,
  periodLabel: Type.String(),
  publishedAt: PublishedAtSchema,
  title: Type.String(),
});

export const IugySelectionCycleResponseSchema = resourceResponse(
  IugySelectionCycleSchema,
);

export const IugyCalendarEventSchema = Type.Object({
  description: Type.String(),
  displayOrder: Type.Integer(),
  id: IdentifierSchema,
  periodLabel: Type.String(),
  publishedAt: PublishedAtSchema,
  selectionCycleId: IdentifierSchema,
  title: Type.String(),
});

export const IugyEventsQuerySchema = Type.Object(
  {
    order: Type.Optional(
      Type.Union([Type.Literal('asc'), Type.Literal('desc')], {
        default: 'asc',
      }),
    ),
    page: PageSchema,
    pageSize: PageSizeSchema,
    sort: Type.Optional(
      Type.Union(
        [
          Type.Literal('displayOrder'),
          Type.Literal('publishedAt'),
          Type.Literal('title'),
        ],
        { default: 'displayOrder' },
      ),
    ),
  },
  { additionalProperties: false },
);

export const IugyEventsResponseSchema = collectionResponse(IugyCalendarEventSchema);

export type IugyInstitution = Static<typeof IugyInstitutionSchema>;
export type IugyInstitutionResponse = Static<typeof IugyInstitutionResponseSchema>;
export type IugyProgram = Static<typeof IugyProgramSchema>;
export type IugyProgramsQuery = Static<typeof IugyProgramsQuerySchema>;
export type IugyProgramsResponse = Static<typeof IugyProgramsResponseSchema>;
export type IugyNotice = Static<typeof IugyNoticeSchema>;
export type IugyNoticesQuery = Static<typeof IugyNoticesQuerySchema>;
export type IugyNoticesResponse = Static<typeof IugyNoticesResponseSchema>;
export type IugySelectionCycle = Static<typeof IugySelectionCycleSchema>;
export type IugySelectionCycleResponse = Static<typeof IugySelectionCycleResponseSchema>;
export type IugyCalendarEvent = Static<typeof IugyCalendarEventSchema>;
export type IugyEventsQuery = Static<typeof IugyEventsQuerySchema>;
export type IugyEventsResponse = Static<typeof IugyEventsResponseSchema>;
export type SortOrder = Static<typeof SortOrderSchema>;

function resourceResponse<T extends TObject>(resourceSchema: T) {
  return Type.Object({
    data: resourceSchema,
  });
}

function collectionResponse<T extends TSchema>(itemSchema: T) {
  return Type.Object({
    data: Type.Array(itemSchema),
    pagination: PaginationSchema,
  });
}
