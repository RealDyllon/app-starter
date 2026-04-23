import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export * from "./auth-schema";

export const todoStatuses = ["backlog", "in_progress", "done"] as const;

export type TodoStatus = (typeof todoStatuses)[number];

export const todos = pgTable(
	"todos",
	{
		id: text().primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
			}),
		title: text().notNull(),
		notes: text().notNull().default(""),
		status: text().$type<TodoStatus>().notNull().default("backlog"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		index("todos_user_id_idx").on(table.userId),
		index("todos_user_id_updated_at_idx").on(table.userId, table.updatedAt),
	],
);

export const todosRelations = relations(todos, ({ one }) => ({
	user: one(user, {
		fields: [todos.userId],
		references: [user.id],
	}),
}));
