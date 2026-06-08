import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient } from '../src/db/client.js';

describe('IUGY public database model', () => {
  const { client } = createDatabaseClient({ max: 1 });

  afterAll(async () => {
    await client.end();
  });

  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for database integration tests');
    }
  });

  it('keeps the deterministic public seed available', async () => {
    const institutions = await client`
      select id, slug
      from institutions
      where slug = 'iugy'
        and publication_state = 'published'
        and published_at is not null
    `;

    expect(institutions).toHaveLength(1);
  });

  it('rejects published records without a publication timestamp', async () => {
    await expect(client`
      insert into institutions (slug, acronym, name, description, publication_state)
      values (
        ${`invalid-${randomUUID()}`},
        ${`BAD-${randomUUID().slice(0, 8)}`},
        'Invalid Published Institution',
        'This record intentionally violates the publication lifecycle.',
        'published'
      )
    `).rejects.toThrow();
  });

  it('updates updated_at inside the database on row changes', async () => {
    const id = randomUUID();
    const slug = `trigger-${id}`;

    try {
      await client`
        insert into institutions (
          id,
          slug,
          acronym,
          name,
          description,
          publication_state,
          created_at,
          updated_at
        )
        values (
          ${id},
          ${slug},
          ${`TRG-${id.slice(0, 8)}`},
          'Trigger Test Institution',
          'Draft record used to verify the updated_at trigger.',
          'draft',
          '1988-01-01T00:00:00.000Z',
          '1988-01-01T00:00:00.000Z'
        )
      `;

      const updatedRows = await client`
        update institutions
        set description = 'Updated by integration test.'
        where id = ${id}
        returning updated_at
      `;

      expect(new Date(updatedRows[0].updated_at).getFullYear()).toBeGreaterThan(2000);
    } finally {
      await client`
        delete from institutions
        where id = ${id}
      `;
    }
  });
});
