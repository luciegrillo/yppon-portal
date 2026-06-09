import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { createDatabaseClient } from './client.js';

const { client, db } = createDatabaseClient({ max: 1 });

try {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Database migrations applied.');
} finally {
  await client.end();
}
