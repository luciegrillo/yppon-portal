import type { FastifyInstance } from 'fastify';
import { Type, type Static } from '@sinclair/typebox';
import { ErrorResponseSchema } from '../../http/errors.js';

export const HealthResponseSchema = Type.Object({
  service: Type.Literal('yppon-api'),
  status: Type.Literal('ok'),
  version: Type.String(),
});

type HealthResponse = Static<typeof HealthResponseSchema>;

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/health',
    {
      schema: {
        response: {
          200: HealthResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async (): Promise<HealthResponse> => ({
      service: 'yppon-api',
      status: 'ok',
      version: '0.1.0',
    }),
  );
}
