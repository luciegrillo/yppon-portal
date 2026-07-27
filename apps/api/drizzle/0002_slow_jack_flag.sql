ALTER TABLE "iugy_calendar_events" DROP CONSTRAINT "iugy_calendar_events_selection_cycle_id_iugy_selection_cycles_id_fk";
--> statement-breakpoint
ALTER TABLE "iugy_notices" DROP CONSTRAINT "iugy_notices_formation_id_iugy_academic_formations_id_fk";
--> statement-breakpoint
ALTER TABLE "iugy_notices" DROP CONSTRAINT "iugy_notices_selection_cycle_id_iugy_selection_cycles_id_fk";
--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_academic_formations_identity_unique" ON "iugy_academic_formations" USING btree ("id","institution_id");--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_selection_cycles_identity_unique" ON "iugy_selection_cycles" USING btree ("id","institution_id");--> statement-breakpoint
ALTER TABLE "iugy_calendar_events" ADD CONSTRAINT "iugy_calendar_events_cycle_institution_fk" FOREIGN KEY ("selection_cycle_id","institution_id") REFERENCES "public"."iugy_selection_cycles"("id","institution_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_notices" ADD CONSTRAINT "iugy_notices_formation_institution_fk" FOREIGN KEY ("formation_id","institution_id") REFERENCES "public"."iugy_academic_formations"("id","institution_id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_notices" ADD CONSTRAINT "iugy_notices_cycle_institution_fk" FOREIGN KEY ("selection_cycle_id","institution_id") REFERENCES "public"."iugy_selection_cycles"("id","institution_id") ON DELETE restrict ON UPDATE cascade;
