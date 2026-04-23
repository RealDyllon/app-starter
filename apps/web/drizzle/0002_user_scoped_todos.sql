ALTER TABLE "todos" ADD COLUMN "user_id" text;
--> statement-breakpoint
DELETE FROM "todos";
--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "todos_user_id_idx" ON "todos" USING btree ("user_id");
