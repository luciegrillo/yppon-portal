CREATE TYPE "public"."iugy_notice_status" AS ENUM('aberto', 'encerrado', 'previsto');--> statement-breakpoint
CREATE TYPE "public"."official_document_status" AS ENUM('preparacao', 'vigente', 'revogado');--> statement-breakpoint
CREATE TYPE "public"."publication_state" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"acronym" varchar(24) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"publication_state" "publication_state" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "iugy_academic_formations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"level_code" varchar(8) NOT NULL,
	"title" varchar(120) NOT NULL,
	"external_reference" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"display_order" integer NOT NULL,
	"publication_state" "publication_state" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "iugy_calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"selection_cycle_id" uuid NOT NULL,
	"period_label" varchar(80) NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"display_order" integer NOT NULL,
	"publication_state" "publication_state" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "iugy_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"formation_id" uuid,
	"selection_cycle_id" uuid NOT NULL,
	"code" varchar(48) NOT NULL,
	"title" varchar(180) NOT NULL,
	"status" "iugy_notice_status" NOT NULL,
	"level_label" varchar(80) NOT NULL,
	"period_label" varchar(80) NOT NULL,
	"publication_state" "publication_state" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "iugy_selection_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"cycle_number" integer NOT NULL,
	"title" varchar(120) NOT NULL,
	"period_label" varchar(80) NOT NULL,
	"publication_state" "publication_state" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "official_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"status" "official_document_status" DEFAULT 'preparacao' NOT NULL,
	"canonical_url" text,
	"publication_state" "publication_state" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "iugy_academic_formations" ADD CONSTRAINT "iugy_academic_formations_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_calendar_events" ADD CONSTRAINT "iugy_calendar_events_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_calendar_events" ADD CONSTRAINT "iugy_calendar_events_selection_cycle_id_iugy_selection_cycles_id_fk" FOREIGN KEY ("selection_cycle_id") REFERENCES "public"."iugy_selection_cycles"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_notices" ADD CONSTRAINT "iugy_notices_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_notices" ADD CONSTRAINT "iugy_notices_formation_id_iugy_academic_formations_id_fk" FOREIGN KEY ("formation_id") REFERENCES "public"."iugy_academic_formations"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_notices" ADD CONSTRAINT "iugy_notices_selection_cycle_id_iugy_selection_cycles_id_fk" FOREIGN KEY ("selection_cycle_id") REFERENCES "public"."iugy_selection_cycles"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "iugy_selection_cycles" ADD CONSTRAINT "iugy_selection_cycles_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "official_documents" ADD CONSTRAINT "official_documents_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_slug_unique" ON "institutions" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_acronym_unique" ON "institutions" USING btree ("acronym");--> statement-breakpoint
CREATE INDEX "institutions_publication_state_idx" ON "institutions" USING btree ("publication_state");--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_academic_formations_level_unique" ON "iugy_academic_formations" USING btree ("institution_id","level_code");--> statement-breakpoint
CREATE INDEX "iugy_academic_formations_institution_idx" ON "iugy_academic_formations" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "iugy_academic_formations_public_order_idx" ON "iugy_academic_formations" USING btree ("publication_state","display_order");--> statement-breakpoint
CREATE INDEX "iugy_calendar_events_institution_idx" ON "iugy_calendar_events" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "iugy_calendar_events_cycle_idx" ON "iugy_calendar_events" USING btree ("selection_cycle_id");--> statement-breakpoint
CREATE INDEX "iugy_calendar_events_public_order_idx" ON "iugy_calendar_events" USING btree ("publication_state","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_notices_code_unique" ON "iugy_notices" USING btree ("code");--> statement-breakpoint
CREATE INDEX "iugy_notices_institution_idx" ON "iugy_notices" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "iugy_notices_formation_idx" ON "iugy_notices" USING btree ("formation_id");--> statement-breakpoint
CREATE INDEX "iugy_notices_cycle_idx" ON "iugy_notices" USING btree ("selection_cycle_id");--> statement-breakpoint
CREATE INDEX "iugy_notices_public_cycle_idx" ON "iugy_notices" USING btree ("publication_state","selection_cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "iugy_selection_cycles_number_unique" ON "iugy_selection_cycles" USING btree ("institution_id","cycle_number");--> statement-breakpoint
CREATE INDEX "iugy_selection_cycles_public_number_idx" ON "iugy_selection_cycles" USING btree ("publication_state","cycle_number");--> statement-breakpoint
CREATE UNIQUE INDEX "official_documents_slug_unique" ON "official_documents" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "official_documents_institution_idx" ON "official_documents" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "official_documents_public_status_idx" ON "official_documents" USING btree ("publication_state","status");