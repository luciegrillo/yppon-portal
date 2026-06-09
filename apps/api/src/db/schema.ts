import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const lifecycleColumns = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
};

export const publicationStateEnum = pgEnum('publication_state', [
  'draft',
  'published',
  'archived',
]);

export const noticeStatusEnum = pgEnum('iugy_notice_status', [
  'aberto',
  'encerrado',
  'previsto',
]);

export const officialDocumentStatusEnum = pgEnum('official_document_status', [
  'preparacao',
  'vigente',
  'revogado',
]);

export const institutions = pgTable(
  'institutions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 80 }).notNull(),
    acronym: varchar('acronym', { length: 24 }).notNull(),
    name: varchar('name', { length: 160 }).notNull(),
    description: text('description').notNull(),
    publicationState: publicationStateEnum('publication_state')
      .default('draft')
      .notNull(),
    ...lifecycleColumns,
  },
  (table) => [
    uniqueIndex('institutions_slug_unique').on(table.slug),
    uniqueIndex('institutions_acronym_unique').on(table.acronym),
    index('institutions_publication_state_idx').on(table.publicationState),
    check(
      'institutions_publication_lifecycle_check',
      sql`
        (${table.publicationState} = 'draft' and ${table.publishedAt} is null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'published' and ${table.publishedAt} is not null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'archived' and ${table.publishedAt} is not null and ${table.archivedAt} is not null and ${table.archivedAt} >= ${table.publishedAt})
      `,
    ),
  ],
);

export const iugyAcademicFormations = pgTable(
  'iugy_academic_formations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    institutionId: uuid('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    levelCode: varchar('level_code', { length: 8 }).notNull(),
    title: varchar('title', { length: 120 }).notNull(),
    externalReference: varchar('external_reference', { length: 160 }).notNull(),
    description: text('description').notNull(),
    displayOrder: integer('display_order').notNull(),
    publicationState: publicationStateEnum('publication_state')
      .default('draft')
      .notNull(),
    ...lifecycleColumns,
  },
  (table) => [
    uniqueIndex('iugy_academic_formations_level_unique').on(
      table.institutionId,
      table.levelCode,
    ),
    index('iugy_academic_formations_institution_idx').on(table.institutionId),
    index('iugy_academic_formations_public_order_idx').on(
      table.publicationState,
      table.displayOrder,
    ),
    check(
      'iugy_academic_formations_publication_lifecycle_check',
      sql`
        (${table.publicationState} = 'draft' and ${table.publishedAt} is null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'published' and ${table.publishedAt} is not null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'archived' and ${table.publishedAt} is not null and ${table.archivedAt} is not null and ${table.archivedAt} >= ${table.publishedAt})
      `,
    ),
  ],
);

export const iugySelectionCycles = pgTable(
  'iugy_selection_cycles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    institutionId: uuid('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    cycleNumber: integer('cycle_number').notNull(),
    title: varchar('title', { length: 120 }).notNull(),
    periodLabel: varchar('period_label', { length: 80 }).notNull(),
    publicationState: publicationStateEnum('publication_state')
      .default('draft')
      .notNull(),
    ...lifecycleColumns,
  },
  (table) => [
    uniqueIndex('iugy_selection_cycles_number_unique').on(
      table.institutionId,
      table.cycleNumber,
    ),
    index('iugy_selection_cycles_public_number_idx').on(
      table.publicationState,
      table.cycleNumber,
    ),
    check(
      'iugy_selection_cycles_publication_lifecycle_check',
      sql`
        (${table.publicationState} = 'draft' and ${table.publishedAt} is null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'published' and ${table.publishedAt} is not null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'archived' and ${table.publishedAt} is not null and ${table.archivedAt} is not null and ${table.archivedAt} >= ${table.publishedAt})
      `,
    ),
  ],
);

export const iugyNotices = pgTable(
  'iugy_notices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    institutionId: uuid('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    formationId: uuid('formation_id').references(() => iugyAcademicFormations.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
    selectionCycleId: uuid('selection_cycle_id')
      .notNull()
      .references(() => iugySelectionCycles.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    code: varchar('code', { length: 48 }).notNull(),
    title: varchar('title', { length: 180 }).notNull(),
    status: noticeStatusEnum('status').notNull(),
    levelLabel: varchar('level_label', { length: 80 }).notNull(),
    periodLabel: varchar('period_label', { length: 80 }).notNull(),
    publicationState: publicationStateEnum('publication_state')
      .default('draft')
      .notNull(),
    ...lifecycleColumns,
  },
  (table) => [
    uniqueIndex('iugy_notices_code_unique').on(table.code),
    index('iugy_notices_institution_idx').on(table.institutionId),
    index('iugy_notices_formation_idx').on(table.formationId),
    index('iugy_notices_cycle_idx').on(table.selectionCycleId),
    index('iugy_notices_public_cycle_idx').on(
      table.publicationState,
      table.selectionCycleId,
    ),
    check(
      'iugy_notices_publication_lifecycle_check',
      sql`
        (${table.publicationState} = 'draft' and ${table.publishedAt} is null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'published' and ${table.publishedAt} is not null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'archived' and ${table.publishedAt} is not null and ${table.archivedAt} is not null and ${table.archivedAt} >= ${table.publishedAt})
      `,
    ),
  ],
);

export const iugyCalendarEvents = pgTable(
  'iugy_calendar_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    institutionId: uuid('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    selectionCycleId: uuid('selection_cycle_id')
      .notNull()
      .references(() => iugySelectionCycles.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    periodLabel: varchar('period_label', { length: 80 }).notNull(),
    title: varchar('title', { length: 160 }).notNull(),
    description: text('description').notNull(),
    displayOrder: integer('display_order').notNull(),
    publicationState: publicationStateEnum('publication_state')
      .default('draft')
      .notNull(),
    ...lifecycleColumns,
  },
  (table) => [
    index('iugy_calendar_events_institution_idx').on(table.institutionId),
    index('iugy_calendar_events_cycle_idx').on(table.selectionCycleId),
    index('iugy_calendar_events_public_order_idx').on(
      table.publicationState,
      table.displayOrder,
    ),
    check(
      'iugy_calendar_events_publication_lifecycle_check',
      sql`
        (${table.publicationState} = 'draft' and ${table.publishedAt} is null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'published' and ${table.publishedAt} is not null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'archived' and ${table.publishedAt} is not null and ${table.archivedAt} is not null and ${table.archivedAt} >= ${table.publishedAt})
      `,
    ),
  ],
);

export const officialDocuments = pgTable(
  'official_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    institutionId: uuid('institution_id')
      .notNull()
      .references(() => institutions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    slug: varchar('slug', { length: 120 }).notNull(),
    title: varchar('title', { length: 180 }).notNull(),
    description: text('description').notNull(),
    status: officialDocumentStatusEnum('status').default('preparacao').notNull(),
    canonicalUrl: text('canonical_url'),
    publicationState: publicationStateEnum('publication_state')
      .default('draft')
      .notNull(),
    ...lifecycleColumns,
  },
  (table) => [
    uniqueIndex('official_documents_slug_unique').on(table.slug),
    index('official_documents_institution_idx').on(table.institutionId),
    index('official_documents_public_status_idx').on(
      table.publicationState,
      table.status,
    ),
    check(
      'official_documents_publication_lifecycle_check',
      sql`
        (${table.publicationState} = 'draft' and ${table.publishedAt} is null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'published' and ${table.publishedAt} is not null and ${table.archivedAt} is null)
        or (${table.publicationState} = 'archived' and ${table.publishedAt} is not null and ${table.archivedAt} is not null and ${table.archivedAt} >= ${table.publishedAt})
      `,
    ),
  ],
);

export const institutionsRelations = relations(institutions, ({ many }) => ({
  calendarEvents: many(iugyCalendarEvents),
  formations: many(iugyAcademicFormations),
  notices: many(iugyNotices),
  officialDocuments: many(officialDocuments),
  selectionCycles: many(iugySelectionCycles),
}));

export const iugyAcademicFormationsRelations = relations(
  iugyAcademicFormations,
  ({ many, one }) => ({
    institution: one(institutions, {
      fields: [iugyAcademicFormations.institutionId],
      references: [institutions.id],
    }),
    notices: many(iugyNotices),
  }),
);

export const iugySelectionCyclesRelations = relations(
  iugySelectionCycles,
  ({ many, one }) => ({
    calendarEvents: many(iugyCalendarEvents),
    institution: one(institutions, {
      fields: [iugySelectionCycles.institutionId],
      references: [institutions.id],
    }),
    notices: many(iugyNotices),
  }),
);

export const iugyNoticesRelations = relations(iugyNotices, ({ one }) => ({
  formation: one(iugyAcademicFormations, {
    fields: [iugyNotices.formationId],
    references: [iugyAcademicFormations.id],
  }),
  institution: one(institutions, {
    fields: [iugyNotices.institutionId],
    references: [institutions.id],
  }),
  selectionCycle: one(iugySelectionCycles, {
    fields: [iugyNotices.selectionCycleId],
    references: [iugySelectionCycles.id],
  }),
}));

export const iugyCalendarEventsRelations = relations(iugyCalendarEvents, ({ one }) => ({
  institution: one(institutions, {
    fields: [iugyCalendarEvents.institutionId],
    references: [institutions.id],
  }),
  selectionCycle: one(iugySelectionCycles, {
    fields: [iugyCalendarEvents.selectionCycleId],
    references: [iugySelectionCycles.id],
  }),
}));

export const officialDocumentsRelations = relations(officialDocuments, ({ one }) => ({
  institution: one(institutions, {
    fields: [officialDocuments.institutionId],
    references: [institutions.id],
  }),
}));
