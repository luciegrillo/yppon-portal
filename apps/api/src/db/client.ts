import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadApiConfig } from '../config/env.js';
import * as schema from './schema.js';

type DatabaseClientOptions = {
  max?: number;
};

export function createDatabaseClient({ max = 10 }: DatabaseClientOptions = {}) {
  const { databaseUrl } = loadApiConfig();
  const client = postgres(databaseUrl, { max });
  const db = drizzle(client, { schema });

  return { client, db };
}
