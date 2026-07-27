import { describe, expect, it, vi } from 'vitest';
import type { IugyRepository } from '../src/modules/iugy/iugy.repository.js';
import { buildTestApp } from './helpers/app.js';

const ids = {
  cycle: '00000000-0000-4000-8000-000000001988',
  event: '00000000-0000-4000-8000-000000005001',
  formation: '00000000-0000-4000-8000-000000002001',
  institution: '00000000-0000-4000-8000-000000000001',
  notice: '00000000-0000-4000-8000-000000003001',
};

const publishedAt = new Date('1988-02-01T00:00:00.000Z');

describe('IUGY public HTTP routes', () => {
  it('returns the public institution and its explicitly current cycle', async () => {
    const repository = createRepository({
      async findCurrentSelectionCycle() {
        return {
          cycleNumber: 1988,
          id: ids.cycle,
          periodLabel: 'Ciclo 1988',
          publishedAt,
          title: 'Ciclo 1988',
        };
      },
      async findInstitution() {
        return {
          acronym: 'IUGY',
          description: 'Universidade pública de Yppon.',
          id: ids.institution,
          name: 'Instituto Universitário Geral de Yppon',
          publishedAt,
          slug: 'iugy',
        };
      },
    });
    const app = await buildTestApp(undefined, repository);

    try {
      const institutionResponse = await app.inject({
        method: 'GET',
        url: '/api/v1/iugy',
      });
      const cycleResponse = await app.inject({
        method: 'GET',
        url: '/api/v1/iugy/selection-cycles/current',
      });

      expect(institutionResponse.statusCode).toBe(200);
      expect(institutionResponse.json()).toStrictEqual({
        data: {
          acronym: 'IUGY',
          description: 'Universidade pública de Yppon.',
          id: ids.institution,
          name: 'Instituto Universitário Geral de Yppon',
          publishedAt: publishedAt.toISOString(),
          slug: 'iugy',
        },
      });
      expect(cycleResponse.statusCode).toBe(200);
      expect(cycleResponse.json()).toStrictEqual({
        data: {
          cycleNumber: 1988,
          id: ids.cycle,
          periodLabel: 'Ciclo 1988',
          publishedAt: publishedAt.toISOString(),
          title: 'Ciclo 1988',
        },
      });
    } finally {
      await app.close();
    }
  });

  it('paginates and sorts programs through the application service', async () => {
    const listPrograms = vi.fn(async () => ({
      items: [
        {
          description: 'Formação avançada.',
          displayOrder: 2,
          externalReference: 'Referência externa: mestrado',
          id: ids.formation,
          levelCode: 'II',
          publishedAt,
          title: 'Nível Superior',
        },
      ],
      totalItems: 3,
    }));
    const app = await buildTestApp(undefined, createRepository({ listPrograms }));

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/iugy/programs?page=2&pageSize=1&sort=title&order=desc',
      });

      expect(response.statusCode).toBe(200);
      expect(listPrograms).toHaveBeenCalledWith({
        limit: 1,
        offset: 1,
        order: 'desc',
        sort: 'title',
      });
      expect(response.json()).toStrictEqual({
        data: [
          {
            description: 'Formação avançada.',
            displayOrder: 2,
            externalReference: 'Referência externa: mestrado',
            id: ids.formation,
            levelCode: 'II',
            publishedAt: publishedAt.toISOString(),
            title: 'Nível Superior',
          },
        ],
        pagination: {
          page: 2,
          pageSize: 1,
          totalItems: 3,
          totalPages: 3,
        },
      });
    } finally {
      await app.close();
    }
  });

  it('uses stable default ordering for notices', async () => {
    const listNotices = vi.fn(async () => ({
      items: [
        {
          code: 'IUGY-1988/001',
          formationId: ids.formation,
          id: ids.notice,
          levelLabel: 'Nível Superior',
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt,
          selectionCycleId: ids.cycle,
          status: 'encerrado' as const,
          title: 'Vagas Remanescentes',
        },
      ],
      totalItems: 1,
    }));
    const app = await buildTestApp(undefined, createRepository({ listNotices }));

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/iugy/notices',
      });

      expect(response.statusCode).toBe(200);
      expect(listNotices).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        order: 'desc',
        sort: 'publishedAt',
      });
      expect(response.json()).toStrictEqual({
        data: [
          {
            code: 'IUGY-1988/001',
            formationId: ids.formation,
            id: ids.notice,
            levelLabel: 'Nível Superior',
            periodLabel: 'Ciclo 1988 · Período I',
            publishedAt: publishedAt.toISOString(),
            selectionCycleId: ids.cycle,
            status: 'encerrado',
            title: 'Vagas Remanescentes',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1,
        },
      });
    } finally {
      await app.close();
    }
  });

  it('returns paginated calendar events', async () => {
    const listEvents = vi.fn(async () => ({
      items: [
        {
          description: 'Recepção e primeiros módulos.',
          displayOrder: 1,
          id: ids.event,
          periodLabel: 'Ciclo 1988 · Período I',
          publishedAt,
          selectionCycleId: ids.cycle,
          title: 'Abertura',
        },
      ],
      totalItems: 1,
    }));
    const app = await buildTestApp(undefined, createRepository({ listEvents }));

    try {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/iugy/events?sort=displayOrder&order=asc',
      });

      expect(response.statusCode).toBe(200);
      expect(listEvents).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        order: 'asc',
        sort: 'displayOrder',
      });
      expect(response.json()).toStrictEqual({
        data: [
          {
            description: 'Recepção e primeiros módulos.',
            displayOrder: 1,
            id: ids.event,
            periodLabel: 'Ciclo 1988 · Período I',
            publishedAt: publishedAt.toISOString(),
            selectionCycleId: ids.cycle,
            title: 'Abertura',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1,
        },
      });
    } finally {
      await app.close();
    }
  });

  it.each([
    '/api/v1/iugy/programs?page=0',
    '/api/v1/iugy/notices?pageSize=101',
    '/api/v1/iugy/events?sort=unknown',
  ])('rejects invalid list parameters for %s', async (url) => {
    const app = await buildTestApp();

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'test-iugy-validation' },
        method: 'GET',
        url,
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toStrictEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Parâmetros da requisição inválidos.',
          requestId: 'test-iugy-validation',
        },
      });
    } finally {
      await app.close();
    }
  });

  it.each(['/api/v1/iugy', '/api/v1/iugy/selection-cycles/current'])(
    'uses the public not-found contract for %s',
    async (url) => {
      const app = await buildTestApp();

      try {
        const response = await app.inject({
          headers: { 'x-request-id': 'test-iugy-not-found' },
          method: 'GET',
          url,
        });

        expect(response.statusCode).toBe(404);
        expect(response.json()).toStrictEqual({
          error: {
            code: 'NOT_FOUND',
            message: 'Recurso não encontrado.',
            requestId: 'test-iugy-not-found',
          },
        });
      } finally {
        await app.close();
      }
    },
  );

  it('does not expose repository failures', async () => {
    const app = await buildTestApp(
      undefined,
      createRepository({
        async listPrograms() {
          throw new Error('private PostgreSQL connection detail');
        },
      }),
    );

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'test-iugy-repository-error' },
        method: 'GET',
        url: '/api/v1/iugy/programs',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toStrictEqual({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Não foi possível processar a requisição.',
          requestId: 'test-iugy-repository-error',
        },
      });
      expect(response.body).not.toContain('private PostgreSQL connection detail');
    } finally {
      await app.close();
    }
  });
});

function createRepository(overrides: Partial<IugyRepository> = {}): IugyRepository {
  return {
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
    ...overrides,
  };
}
