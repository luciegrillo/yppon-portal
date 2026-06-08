import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { config as loadDotenv } from 'dotenv';

for (const envPath of [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '../../.env'),
]) {
  if (existsSync(envPath)) loadDotenv({ path: envPath, override: false });
}

const DEFAULT_DATABASE_URL = 'postgresql://yppon:yppon@127.0.0.1:5432/yppon_portal';

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
  DATABASE_URL: Type.String({ minLength: 1 }),
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('test'),
    Type.Literal('production'),
  ]),
});

export type ApiConfig = {
  databaseUrl: string;
  host: string;
  isProduction: boolean;
  logLevel: string;
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
};

export function loadApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const nodeEnv = env.NODE_ENV ?? 'development';
  const candidate = {
    API_HOST: env.API_HOST ?? '127.0.0.1',
    API_LOG_LEVEL: env.API_LOG_LEVEL ?? 'info',
    API_PORT: env.API_PORT ?? '3333',
    DATABASE_URL:
      env.DATABASE_URL ?? (nodeEnv === 'production' ? undefined : DEFAULT_DATABASE_URL),
    NODE_ENV: nodeEnv,
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

  validateDatabaseUrl(candidate.DATABASE_URL);

  return {
    databaseUrl: candidate.DATABASE_URL,
    host: candidate.API_HOST,
    isProduction: candidate.NODE_ENV === 'production',
    logLevel: candidate.API_LOG_LEVEL,
    nodeEnv: candidate.NODE_ENV,
    port,
  };
}

function validateDatabaseUrl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);

    if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
      throw new Error('unsupported protocol');
    }
  } catch {
    throw new Error('Invalid API environment: /DATABASE_URL must be a PostgreSQL URL');
  }
}
