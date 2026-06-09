import { Type } from '@sinclair/typebox';
import { describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app.js';

describe('API HTTP routes', () => {
  it('responds to the health check with a stable public contract', async () => {
    const app = await buildTestApp();

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'test-health' },
        method: 'GET',
        url: '/api/v1/health',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toStrictEqual({
        service: 'yppon-api',
        status: 'ok',
        version: '0.1.0',
      });
    } finally {
      await app.close();
    }
  });
});

describe('API public errors', () => {
  it('returns a consistent not-found response', async () => {
    const app = await buildTestApp();

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'test-not-found' },
        method: 'GET',
        url: '/api/v1/missing',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toStrictEqual({
        error: {
          code: 'NOT_FOUND',
          message: 'Recurso não encontrado.',
          requestId: 'test-not-found',
        },
      });
    } finally {
      await app.close();
    }
  });

  it('hides unexpected internal error messages', async () => {
    const app = await buildTestApp((instance) => {
      instance.get('/api/v1/test/unexpected-error', async () => {
        throw new Error('internal database detail');
      });
    });

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'test-internal-error' },
        method: 'GET',
        url: '/api/v1/test/unexpected-error',
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toStrictEqual({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Não foi possível processar a requisição.',
          requestId: 'test-internal-error',
        },
      });
      expect(response.body).not.toContain('internal database detail');
    } finally {
      await app.close();
    }
  });

  it('normalizes validation failures into the public error shape', async () => {
    const app = await buildTestApp((instance) => {
      instance.post(
        '/api/v1/test/validation',
        {
          schema: {
            body: Type.Object({
              name: Type.String({ minLength: 1 }),
            }),
            response: {
              200: Type.Object({
                ok: Type.Boolean(),
              }),
            },
          },
        },
        async () => ({ ok: true }),
      );
    });

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'test-validation' },
        method: 'POST',
        payload: {},
        url: '/api/v1/test/validation',
      });
      const body = response.json();

      expect(response.statusCode).toBe(400);
      expect(body.error.code).toBe('REQUEST_ERROR');
      expect(body.error.requestId).toBe('test-validation');
      expect(typeof body.error.message).toBe('string');
      expect(body.error.message.length).toBeGreaterThan(0);
    } finally {
      await app.close();
    }
  });
});
