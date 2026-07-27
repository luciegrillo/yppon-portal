import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createDatabaseClient } from '../src/db/client.js';
import { createPostgresIugyRepository } from '../src/modules/iugy/iugy.repository.js';

const fixture = {
  cycles: {
    current: randomUUID(),
    next: randomUUID(),
  },
  events: {
    archived: randomUUID(),
    draft: randomUUID(),
    first: randomUUID(),
    second: randomUUID(),
  },
  formations: {
    archived: randomUUID(),
    draft: randomUUID(),
    first: randomUUID(),
    second: randomUUID(),
  },
  institution: randomUUID(),
  notices: {
    archived: randomUUID(),
    draft: randomUUID(),
    first: randomUUID(),
    second: randomUUID(),
  },
};

const fixtureSlug = `iugy-repository-${fixture.institution}`;
const publishedAt = '2026-01-01T00:00:00.000Z';
const archivedAt = '2026-02-01T00:00:00.000Z';
const { client, db } = createDatabaseClient({ max: 2 });
const repository = createPostgresIugyRepository(db, {
  institutionSlug: fixtureSlug,
});

describe('IUGY PostgreSQL public repository', () => {
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
      values (
        ${fixture.institution},
        ${fixtureSlug},
        ${`T-${fixture.institution.slice(0, 8)}`},
        'IUGY Repository Test',
        'Isolated institution used by repository integration tests.',
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
        is_current,
        publication_state,
        published_at
      )
      values
        (
          ${fixture.cycles.current},
          ${fixture.institution},
          3000,
          'Current Test Cycle',
          'Ciclo 3000',
          true,
          'published',
          ${publishedAt}
        ),
        (
          ${fixture.cycles.next},
          ${fixture.institution},
          3001,
          'Next Test Cycle',
          'Ciclo 3001',
          false,
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
        published_at,
        archived_at
      )
      values
        (
          ${fixture.formations.first},
          ${fixture.institution},
          'T1',
          'First Published Formation',
          'Test reference one',
          'First published fixture.',
          1,
          'published',
          ${publishedAt},
          null
        ),
        (
          ${fixture.formations.second},
          ${fixture.institution},
          'T2',
          'Second Published Formation',
          'Test reference two',
          'Second published fixture.',
          2,
          'published',
          ${publishedAt},
          null
        ),
        (
          ${fixture.formations.draft},
          ${fixture.institution},
          'TD',
          'Draft Formation',
          'Draft test reference',
          'This fixture must stay private.',
          0,
          'draft',
          null,
          null
        ),
        (
          ${fixture.formations.archived},
          ${fixture.institution},
          'TA',
          'Archived Formation',
          'Archived test reference',
          'This fixture must stay archived.',
          3,
          'archived',
          ${publishedAt},
          ${archivedAt}
        )
    `;

    await client`
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
        published_at,
        archived_at
      )
      values
        (
          ${fixture.notices.first},
          ${fixture.institution},
          ${fixture.formations.first},
          ${fixture.cycles.current},
          ${`TEST-A-${fixture.institution.slice(0, 8)}`},
          'First Published Notice',
          'aberto',
          'Test Level One',
          'Ciclo 3000 · Período I',
          'published',
          ${publishedAt},
          null
        ),
        (
          ${fixture.notices.second},
          ${fixture.institution},
          ${fixture.formations.second},
          ${fixture.cycles.current},
          ${`TEST-B-${fixture.institution.slice(0, 8)}`},
          'Second Published Notice',
          'encerrado',
          'Test Level Two',
          'Ciclo 3000 · Período II',
          'published',
          ${publishedAt},
          null
        ),
        (
          ${fixture.notices.draft},
          ${fixture.institution},
          null,
          ${fixture.cycles.current},
          ${`TEST-D-${fixture.institution.slice(0, 8)}`},
          'Draft Notice',
          'previsto',
          'Private Test Level',
          'Ciclo 3000 · Rascunho',
          'draft',
          null,
          null
        ),
        (
          ${fixture.notices.archived},
          ${fixture.institution},
          null,
          ${fixture.cycles.current},
          ${`TEST-X-${fixture.institution.slice(0, 8)}`},
          'Archived Notice',
          'encerrado',
          'Archived Test Level',
          'Ciclo 3000 · Arquivado',
          'archived',
          ${publishedAt},
          ${archivedAt}
        )
    `;

    await client`
      insert into iugy_calendar_events (
        id,
        institution_id,
        selection_cycle_id,
        period_label,
        title,
        description,
        display_order,
        publication_state,
        published_at,
        archived_at
      )
      values
        (
          ${fixture.events.first},
          ${fixture.institution},
          ${fixture.cycles.current},
          'Ciclo 3000 · Período I',
          'First Published Event',
          'First published calendar fixture.',
          1,
          'published',
          ${publishedAt},
          null
        ),
        (
          ${fixture.events.second},
          ${fixture.institution},
          ${fixture.cycles.current},
          'Ciclo 3000 · Período II',
          'Second Published Event',
          'Second published calendar fixture.',
          2,
          'published',
          ${publishedAt},
          null
        ),
        (
          ${fixture.events.draft},
          ${fixture.institution},
          ${fixture.cycles.current},
          'Ciclo 3000 · Rascunho',
          'Draft Event',
          'This calendar fixture must stay private.',
          0,
          'draft',
          null,
          null
        ),
        (
          ${fixture.events.archived},
          ${fixture.institution},
          ${fixture.cycles.current},
          'Ciclo 3000 · Arquivado',
          'Archived Event',
          'This calendar fixture must stay archived.',
          3,
          'archived',
          ${publishedAt},
          ${archivedAt}
        )
    `;
  });

  afterAll(async () => {
    try {
      await client`
        delete from iugy_calendar_events
        where institution_id = ${fixture.institution}
      `;
      await client`
        delete from iugy_notices
        where institution_id = ${fixture.institution}
      `;
      await client`
        delete from iugy_academic_formations
        where institution_id = ${fixture.institution}
      `;
      await client`
        delete from iugy_selection_cycles
        where institution_id = ${fixture.institution}
      `;
      await client`
        delete from institutions
        where id = ${fixture.institution}
      `;
    } finally {
      await client.end();
    }
  });

  it('finds only the published institution and explicitly current cycle', async () => {
    const institution = await repository.findInstitution();
    const currentCycle = await repository.findCurrentSelectionCycle();

    expect(institution).toMatchObject({
      id: fixture.institution,
      slug: fixtureSlug,
    });
    expect(currentCycle).toMatchObject({
      cycleNumber: 3000,
      id: fixture.cycles.current,
    });
  });

  it('filters and paginates published programs with deterministic ordering', async () => {
    const firstPage = await repository.listPrograms({
      limit: 1,
      offset: 0,
      order: 'asc',
      sort: 'displayOrder',
    });
    const secondPage = await repository.listPrograms({
      limit: 1,
      offset: 1,
      order: 'asc',
      sort: 'displayOrder',
    });

    expect(firstPage.totalItems).toBe(2);
    expect(firstPage.items.map(({ id }) => id)).toStrictEqual([fixture.formations.first]);
    expect(secondPage.totalItems).toBe(2);
    expect(secondPage.items.map(({ id }) => id)).toStrictEqual([
      fixture.formations.second,
    ]);
  });

  it('filters and orders published notices', async () => {
    const result = await repository.listNotices({
      limit: 10,
      offset: 0,
      order: 'asc',
      sort: 'code',
    });

    expect(result.totalItems).toBe(2);
    expect(result.items.map(({ id }) => id)).toStrictEqual([
      fixture.notices.first,
      fixture.notices.second,
    ]);
  });

  it('filters, orders and paginates published events', async () => {
    const result = await repository.listEvents({
      limit: 1,
      offset: 1,
      order: 'asc',
      sort: 'displayOrder',
    });

    expect(result.totalItems).toBe(2);
    expect(result.items.map(({ id }) => id)).toStrictEqual([fixture.events.second]);
  });
});
