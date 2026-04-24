import { asc, eq } from "drizzle-orm";

import { db } from "#/server/db";
import { todos } from "#/server/db/schema";

export async function listPersistedTodos(userId: string) {
	return db
		.select({
			id: todos.id,
			name: todos.name,
		})
		.from(todos)
		.where(eq(todos.userId, userId))
		.orderBy(asc(todos.createdAt), asc(todos.id));
}

export async function createPersistedTodo(name: string, userId: string) {
	const [todo] = await db
		.insert(todos)
		.values({
			name,
			userId,
		})
		.returning({
			id: todos.id,
			name: todos.name,
		});

	return todo;
}
