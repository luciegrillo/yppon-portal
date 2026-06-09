import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/index.js';

type RegisterTestRoutes = (app: FastifyInstance) => Promise<void> | void;

export async function buildTestApp(
  registerTestRoutes?: RegisterTestRoutes,
): Promise<FastifyInstance> {
  const app = buildApp({ logger: false });

  await registerTestRoutes?.(app);
  await app.ready();

  return app;
}
