import { Type } from '@sinclair/typebox';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { buildLoggerOptions } from '../src/config/logger.js';
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

  it('rejects unsafe caller-provided request identifiers', async () => {
    const app = await buildTestApp();

    try {
      const response = await app.inject({
        headers: { 'x-request-id': 'secret value with spaces' },
        method: 'GET',
        url: '/api/v1/missing',
      });

      expect(response.json().error.requestId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(response.body).not.toContain('secret value with spaces');
    } finally {
      await app.close();
    }
  });

  it('redacts credentials and omits sensitive error details from logs', async () => {
    const logLines: string[] = [];
    const app = buildApp({
      logger: buildLoggerOptions({
        level: 'info',
        stream: {
          write(message) {
            logLines.push(message);
          },
        },
      }),
    });

    app.post('/api/v1/test/log-redaction', async (request) => {
      request.log.info(
        {
          authorization: request.headers.authorization,
          body: request.body,
          headers: request.headers,
        },
        'Testing safe log defaults',
      );

      throw new Error('database detail contains log-secret-password');
    });

    await app.ready();

    try {
      const response = await app.inject({
        headers: {
          authorization: 'Bearer log-secret-token',
          cookie: 'session=log-secret-cookie',
          'x-request-id': 'test-log-redaction',
        },
        method: 'POST',
        payload: {
          password: 'log-secret-password',
          token: 'log-secret-body-token',
        },
        url: '/api/v1/test/log-redaction?token=log-secret-query',
      });
      const logs = logLines.join('');

      expect(response.statusCode).toBe(500);
      expect(response.body).not.toContain('log-secret');
      expect(logs).toContain('[REDACTED]');
      expect(logs).toContain('test-log-redaction');
      expect(logs).not.toContain('log-secret-token');
      expect(logs).not.toContain('log-secret-cookie');
      expect(logs).not.toContain('log-secret-password');
      expect(logs).not.toContain('log-secret-body-token');
      expect(logs).not.toContain('log-secret-query');
      expect(logs).not.toContain('database detail');
    } finally {
      await app.close();
    }
  });
});
