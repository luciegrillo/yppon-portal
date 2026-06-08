import { randomUUID } from 'node:crypto';
import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { registerErrorHandlers } from './http/errors.js';
import { registerHealthRoutes } from './modules/health/health.routes.js';

type BuildAppOptions = {
  logger?: FastifyServerOptions['logger'];
};

export function buildApp({ logger = true }: BuildAppOptions = {}): FastifyInstance {
  const app = Fastify({
    logger,
    genReqId: (request) => request.headers['x-request-id']?.toString() ?? randomUUID(),
  });

  registerErrorHandlers(app);
  app.register(registerHealthRoutes);

  return app;
}
