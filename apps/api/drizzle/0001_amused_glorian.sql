ALTER TABLE "iugy_selection_cycles" ADD COLUMN "is_current" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "iugy_selection_cycles" AS "cycles"
SET "is_current" = true
FROM "institutions"
WHERE "cycles"."institution_id" = "institutions"."id"
	AND "institutions"."slug" = 'iugy'
	AND "cycles"."cycle_number" = 1988
	AND "cycles"."publication_state" = 'published';--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_selection_cycles_current_unique" ON "iugy_selection_cycles" USING btree ("institution_id") WHERE "iugy_selection_cycles"."is_current";--> statement-breakpoint
ALTER TABLE "iugy_selection_cycles" ADD CONSTRAINT "iugy_selection_cycles_current_publication_check" CHECK (not "iugy_selection_cycles"."is_current" or "iugy_selection_cycles"."publication_state" = 'published');
