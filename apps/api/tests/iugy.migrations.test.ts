import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('IUGY data migrations', () => {
  it('backfills the canonical current cycle from domain keys, not seed IDs', async () => {
    const migration = await readFile(
      new URL('../drizzle/0001_amused_glorian.sql', import.meta.url),
      'utf8',
    );

    expect(migration).toContain(`"institutions"."slug" = 'iugy'`);
    expect(migration).toContain(`"cycles"."cycle_number" = 1988`);
    expect(migration).not.toContain('00000000-0000-4000-8000-000000001988');
  });
});
