import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient } from '../src/db/client.js';

const fixture = {
  cycles: {
    first: randomUUID(),
    second: randomUUID(),
  },
  formations: {
    first: randomUUID(),
    second: randomUUID(),
  },
  institutions: {
    first: randomUUID(),
    second: randomUUID(),
  },
};

const publishedAt = '2026-01-01T00:00:00.000Z';
const { client } = createDatabaseClient({ max: 1 });

describe('IUGY institution-scoped relationships', () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for database integration tests');
    }

    await client`
      insert into institutions (
        id,
        slug,
        acronym,
        name,
        description,
        publication_state,
        published_at
      )
      values
        (
          ${fixture.institutions.first},
          ${`iugy-scope-a-${fixture.institutions.first}`},
          ${`A-${fixture.institutions.first.slice(0, 8)}`},
          'Institution Scope A',
          'First isolated institution.',
          'published',
          ${publishedAt}
        ),
        (
          ${fixture.institutions.second},
          ${`iugy-scope-b-${fixture.institutions.second}`},
          ${`B-${fixture.institutions.second.slice(0, 8)}`},
          'Institution Scope B',
          'Second isolated institution.',
          'published',
          ${publishedAt}
        )
    `;

    await client`
      insert into iugy_selection_cycles (
        id,
        institution_id,
        cycle_number,
        title,
        period_label,
        publication_state,
        published_at
      )
      values
        (
          ${fixture.cycles.first},
          ${fixture.institutions.first},
          4101,
          'Scope Cycle A',
          'Ciclo 4101',
          'published',
          ${publishedAt}
        ),
        (
          ${fixture.cycles.second},
          ${fixture.institutions.second},
          4102,
          'Scope Cycle B',
          'Ciclo 4102',
          'published',
          ${publishedAt}
        )
    `;

    await client`
      insert into iugy_academic_formations (
        id,
        institution_id,
        level_code,
        title,
        external_reference,
        description,
        display_order,
        publication_state,
        published_at
      )
      values
        (
          ${fixture.formations.first},
          ${fixture.institutions.first},
          'SA',
          'Scope Formation A',
          'Scope A',
          'First scoped formation.',
          1,
          'published',
          ${publishedAt}
        ),
        (
          ${fixture.formations.second},
          ${fixture.institutions.second},
          'SB',
          'Scope Formation B',
          'Scope B',
          'Second scoped formation.',
          1,
          'published',
          ${publishedAt}
        )
    `;
  });

  afterAll(async () => {
    const cleanupErrors: unknown[] = [];
    const cleanupSteps = [
      () =>
        client`delete from iugy_calendar_events where institution_id in (${fixture.institutions.first}, ${fixture.institutions.second})`,
      () =>
        client`delete from iugy_notices where institution_id in (${fixture.institutions.first}, ${fixture.institutions.second})`,
      () =>
        client`delete from iugy_academic_formations where institution_id in (${fixture.institutions.first}, ${fixture.institutions.second})`,
      () =>
        client`delete from iugy_selection_cycles where institution_id in (${fixture.institutions.first}, ${fixture.institutions.second})`,
      () =>
        client`delete from institutions where id in (${fixture.institutions.first}, ${fixture.institutions.second})`,
    ];

    try {
      for (const cleanup of cleanupSteps) {
        try {
          await cleanup();
        } catch (error) {
          cleanupErrors.push(error);
        }
      }

      if (cleanupErrors.length > 0) {
        throw new AggregateError(cleanupErrors, 'Failed to clean IUGY scope fixtures');
      }
    } finally {
      await client.end();
    }
  });

  it('rejects calendar events linked to another institution cycle', async () => {
    await expect(
      client`
        insert into iugy_calendar_events (
          id,
          institution_id,
          selection_cycle_id,
          period_label,
          title,
          description,
          display_order,
          publication_state,
          published_at
        )
        values (
          ${randomUUID()},
          ${fixture.institutions.first},
          ${fixture.cycles.second},
          'Invalid scope',
          'Cross-institution event',
          'Must be rejected.',
          1,
          'published',
          ${publishedAt}
        )
      `,
    ).rejects.toThrow(/iugy_calendar_events_cycle_institution_fk/);
  });

  it('rejects notices linked to another institution formation', async () => {
    await expect(
      client`
        insert into iugy_notices (
          id,
          institution_id,
          formation_id,
          selection_cycle_id,
          code,
          title,
          status,
          level_label,
          period_label,
          publication_state,
          published_at
        )
        values (
          ${randomUUID()},
          ${fixture.institutions.first},
          ${fixture.formations.second},
          ${fixture.cycles.first},
          ${`SCOPE-F-${fixture.institutions.first.slice(0, 8)}`},
          'Cross-institution formation notice',
          'aberto',
          'Invalid scope',
          'Invalid scope',
          'published',
          ${publishedAt}
        )
      `,
    ).rejects.toThrow(/iugy_notices_formation_institution_fk/);
  });

  it('rejects notices linked to another institution cycle', async () => {
    await expect(
      client`
        insert into iugy_notices (
          id,
          institution_id,
          formation_id,
          selection_cycle_id,
          code,
          title,
          status,
          level_label,
          period_label,
          publication_state,
          published_at
        )
        values (
          ${randomUUID()},
          ${fixture.institutions.first},
          ${fixture.formations.first},
          ${fixture.cycles.second},
          ${`SCOPE-C-${fixture.institutions.first.slice(0, 8)}`},
          'Cross-institution cycle notice',
          'aberto',
          'Invalid scope',
          'Invalid scope',
          'published',
          ${publishedAt}
        )
      `,
    ).rejects.toThrow(/iugy_notices_cycle_institution_fk/);
  });
});
