import { relations } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const todos = pgTable(
	"todos",
	{
		id: serial().primaryKey(),
		name: text().notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
			}),
	},
	(table) => [index("todos_user_id_idx").on(table.userId)],
);

export const todosRelations = relations(todos, ({ one }) => ({
	user: one(user, {
		fields: [todos.userId],
		references: [user.id],
	}),
}));

export * from "./auth-schema";
