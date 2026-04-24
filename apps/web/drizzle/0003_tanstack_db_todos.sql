ALTER TABLE "todos" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "notes" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "status" text DEFAULT 'backlog' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "todos_user_id_updated_at_idx" ON "todos" USING btree ("user_id","updated_at");
