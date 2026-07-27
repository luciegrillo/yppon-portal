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
    genReqId: (request) => resolveRequestId(request.headers['x-request-id']),
  });

  registerErrorHandlers(app);
  app.register(registerHealthRoutes);

  return app;
}

function resolveRequestId(value: string | string[] | undefined) {
  const requestId = Array.isArray(value) ? value[0] : value;

  if (requestId && /^[A-Za-z0-9._:-]{1,128}$/.test(requestId)) {
    return requestId;
  }

  return randomUUID();
}
