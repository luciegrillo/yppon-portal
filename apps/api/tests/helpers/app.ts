import type { FastifyInstance, FastifyServerOptions } from 'fastify';
import { buildApp } from '../../src/index.js';
import type { IugyRepository } from '../../src/modules/iugy/iugy.repository.js';

type RegisterTestRoutes = (app: FastifyInstance) => Promise<void> | void;

export async function buildTestApp(
  registerTestRoutes?: RegisterTestRoutes,
  iugyRepository: IugyRepository = emptyIugyRepository,
  logger: FastifyServerOptions['logger'] = false,
): Promise<FastifyInstance> {
  const app = buildApp({ iugyRepository, logger });

  await registerTestRoutes?.(app);
  await app.ready();

  return app;
}

const emptyIugyRepository: IugyRepository = {
  async findCurrentSelectionCycle() {
    return null;
  },
  async findInstitution() {
    return null;
  },
  async listEvents() {
    return { items: [], totalItems: 0 };
  },
  async listNotices() {
    return { items: [], totalItems: 0 };
  },
  async listPrograms() {
    return { items: [], totalItems: 0 };
  },
};
