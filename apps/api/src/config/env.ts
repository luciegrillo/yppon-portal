import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const EnvSchema = Type.Object({
  API_HOST: Type.String({ minLength: 1 }),
  API_LOG_LEVEL: Type.Union([
    Type.Literal('trace'),
    Type.Literal('debug'),
    Type.Literal('info'),
    Type.Literal('warn'),
    Type.Literal('error'),
    Type.Literal('fatal'),
    Type.Literal('silent'),
  ]),
  API_PORT: Type.String({ pattern: '^[0-9]+$' }),
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('test'),
    Type.Literal('production'),
  ]),
});

export type ApiConfig = {
  host: string;
  isProduction: boolean;
  logLevel: string;
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
};

export function loadApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const candidate = {
    API_HOST: env.API_HOST ?? '127.0.0.1',
    API_LOG_LEVEL: env.API_LOG_LEVEL ?? 'info',
    API_PORT: env.API_PORT ?? '3333',
    NODE_ENV: env.NODE_ENV ?? 'development',
  };

  if (!Value.Check(EnvSchema, candidate)) {
    const details = [...Value.Errors(EnvSchema, candidate)]
      .map((error) => `${error.path || '/'} ${error.message}`)
      .join('; ');

    throw new Error(`Invalid API environment: ${details}`);
  }

  const port = Number(candidate.API_PORT);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('Invalid API environment: /API_PORT must be a valid TCP port');
  }

  return {
    host: candidate.API_HOST,
    isProduction: candidate.NODE_ENV === 'production',
    logLevel: candidate.API_LOG_LEVEL,
    nodeEnv: candidate.NODE_ENV,
    port,
  };
}
