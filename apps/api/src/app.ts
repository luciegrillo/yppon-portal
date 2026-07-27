import { randomUUID } from 'node:crypto';
import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import { buildLoggerOptions } from './config/logger.js';
import { createDatabaseClient } from './db/client.js';
import { registerErrorHandlers } from './http/errors.js';
import { registerHealthRoutes } from './modules/health/health.routes.js';
import { createPostgresIugyRepository } from './modules/iugy/iugy.repository.js';
import { registerIugyRoutes } from './modules/iugy/iugy.routes.js';
import { createIugyService } from './modules/iugy/iugy.service.js';
import type { IugyRepository } from './modules/iugy/iugy.repository.js';

export type BuildAppOptions = {
  iugyRepository?: IugyRepository;
  logger?: FastifyServerOptions['logger'];
};

export function buildApp({
  iugyRepository,
  logger = buildLoggerOptions({ level: 'info' }),
}: BuildAppOptions = {}): FastifyInstance {
  const app = Fastify({
    logger,
    genReqId: (request) => resolveRequestId(request.headers['x-request-id']),
  });
  const database = iugyRepository ? null : createDatabaseClient();
  const repository = iugyRepository ?? createPostgresIugyRepository(database!.db);

  registerErrorHandlers(app);
  app.register(registerHealthRoutes);
  app.register(registerIugyRoutes, {
    service: createIugyService(repository),
  });

  if (database) {
    app.addHook('onClose', async () => {
      await database.client.end();
    });
  }

  return app;
}

function resolveRequestId(value: string | string[] | undefined) {
  const requestId = Array.isArray(value) ? value[0] : value;

  if (requestId && /^[A-Za-z0-9._:-]{1,128}$/.test(requestId)) {
    return requestId;
  }

  return randomUUID();
}
