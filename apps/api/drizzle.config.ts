import { defineConfig } from 'drizzle-kit';
import { loadApiConfig } from './src/config/env.js';

const { databaseUrl } = loadApiConfig();

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  out: './drizzle',
  schema: './src/db/schema.ts',
  strict: true,
  verbose: true,
});
