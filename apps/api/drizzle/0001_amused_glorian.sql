ALTER TABLE "iugy_selection_cycles" ADD COLUMN "is_current" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "iugy_selection_cycles"
SET "is_current" = true
WHERE "id" = '00000000-0000-4000-8000-000000001988'
	AND "publication_state" = 'published';--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_selection_cycles_current_unique" ON "iugy_selection_cycles" USING btree ("institution_id") WHERE "iugy_selection_cycles"."is_current";--> statement-breakpoint
ALTER TABLE "iugy_selection_cycles" ADD CONSTRAINT "iugy_selection_cycles_current_publication_check" CHECK (not "iugy_selection_cycles"."is_current" or "iugy_selection_cycles"."publication_state" = 'published');
