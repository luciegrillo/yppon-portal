import { Type, type Static, type TObject, type TSchema } from '@sinclair/typebox';
import type {
  IugyCalendarEvent,
  IugyEventsResponse,
  IugyInstitution,
  IugyInstitutionResponse,
  IugyNotice,
  IugyNoticesResponse,
  IugyProgram,
  IugyProgramsResponse,
  IugySelectionCycle,
  IugySelectionCycleResponse,
} from '@yppon/contracts/iugy';

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
    current: Type.Optional(Type.Boolean({ default: false })),
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

export type IugyProgramsQuery = Static<typeof IugyProgramsQuerySchema>;
export type IugyNoticesQuery = Static<typeof IugyNoticesQuerySchema>;
export type IugyEventsQuery = Static<typeof IugyEventsQuerySchema>;
export type SortOrder = Static<typeof SortOrderSchema>;

export type {
  IugyCalendarEvent,
  IugyEventsResponse,
  IugyInstitution,
  IugyInstitutionResponse,
  IugyNotice,
  IugyNoticesResponse,
  IugyProgram,
  IugyProgramsResponse,
  IugySelectionCycle,
  IugySelectionCycleResponse,
};

export type ContractsMatchSchemas = [
  Assert<Exact<Static<typeof IugyInstitutionSchema>, IugyInstitution>>,
  Assert<Exact<Static<typeof IugyInstitutionResponseSchema>, IugyInstitutionResponse>>,
  Assert<Exact<Static<typeof IugyProgramSchema>, IugyProgram>>,
  Assert<Exact<Static<typeof IugyProgramsResponseSchema>, IugyProgramsResponse>>,
  Assert<Exact<Static<typeof IugyNoticeSchema>, IugyNotice>>,
  Assert<Exact<Static<typeof IugyNoticesResponseSchema>, IugyNoticesResponse>>,
  Assert<Exact<Static<typeof IugySelectionCycleSchema>, IugySelectionCycle>>,
  Assert<
    Exact<Static<typeof IugySelectionCycleResponseSchema>, IugySelectionCycleResponse>
  >,
  Assert<Exact<Static<typeof IugyCalendarEventSchema>, IugyCalendarEvent>>,
  Assert<Exact<Static<typeof IugyEventsResponseSchema>, IugyEventsResponse>>,
];

type Assert<Value extends true> = Value;

type Exact<Actual, Expected> =
  (<Value>() => Value extends Actual ? 1 : 2) extends <Value>() => Value extends Expected
    ? 1
    : 2
    ? (<Value>() => Value extends Expected ? 1 : 2) extends <
        Value,
      >() => Value extends Actual ? 1 : 2
      ? true
      : false
    : false;

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
