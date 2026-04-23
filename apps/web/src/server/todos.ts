import { asc } from "drizzle-orm";

import { db } from "#/server/db";
import { todos } from "#/server/db/schema";

export async function listPersistedTodos() {
	return db
		.select({
			id: todos.id,
			name: todos.name,
		})
		.from(todos)
		.orderBy(asc(todos.createdAt), asc(todos.id));
}

export async function createPersistedTodo(name: string) {
	const [todo] = await db.insert(todos).values({ name }).returning({
		id: todos.id,
		name: todos.name,
	});

	return todo;
}
