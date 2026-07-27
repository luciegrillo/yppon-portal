import type { FastifyInstance } from 'fastify';
import { ErrorResponseSchema, HttpError } from '../../http/errors.js';
import {
  IugyEventsQuerySchema,
  IugyEventsResponseSchema,
  IugyInstitutionResponseSchema,
  IugyNoticesQuerySchema,
  IugyNoticesResponseSchema,
  IugyProgramsQuerySchema,
  IugyProgramsResponseSchema,
  IugySelectionCycleResponseSchema,
  type IugyEventsQuery,
  type IugyEventsResponse,
  type IugyInstitutionResponse,
  type IugyNoticesQuery,
  type IugyNoticesResponse,
  type IugyProgramsQuery,
  type IugyProgramsResponse,
  type IugySelectionCycleResponse,
} from './iugy.contracts.js';
import type { IugyService } from './iugy.service.js';

type IugyRoutesOptions = {
  service: IugyService;
};

export async function registerIugyRoutes(
  app: FastifyInstance,
  { service }: IugyRoutesOptions,
) {
  app.get(
    '/api/v1/iugy',
    {
      schema: {
        response: {
          200: IugyInstitutionResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (): Promise<IugyInstitutionResponse> =>
      requireResource(await service.getInstitution()),
  );

  app.get<{ Querystring: IugyProgramsQuery }>(
    '/api/v1/iugy/programs',
    {
      schema: {
        querystring: IugyProgramsQuerySchema,
        response: {
          200: IugyProgramsResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request): Promise<IugyProgramsResponse> => service.listPrograms(request.query),
  );

  app.get<{ Querystring: IugyNoticesQuery }>(
    '/api/v1/iugy/notices',
    {
      schema: {
        querystring: IugyNoticesQuerySchema,
        response: {
          200: IugyNoticesResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request): Promise<IugyNoticesResponse> => service.listNotices(request.query),
  );

  app.get(
    '/api/v1/iugy/selection-cycles/current',
    {
      schema: {
        response: {
          200: IugySelectionCycleResponseSchema,
          404: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (): Promise<IugySelectionCycleResponse> =>
      requireResource(await service.getCurrentSelectionCycle()),
  );

  app.get<{ Querystring: IugyEventsQuery }>(
    '/api/v1/iugy/events',
    {
      schema: {
        querystring: IugyEventsQuerySchema,
        response: {
          200: IugyEventsResponseSchema,
          400: ErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (request): Promise<IugyEventsResponse> => service.listEvents(request.query),
  );
}

function requireResource<T>(resource: T | null): T {
  if (!resource) {
    throw new HttpError(404, 'NOT_FOUND', 'Recurso não encontrado.');
  }

  return resource;
}
