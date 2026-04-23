import { and, desc, eq } from "drizzle-orm";

import { db } from "#/server/db";
import { todos } from "#/server/db/schema";

function serializeTodo(todo: {
	id: string;
	userId: string;
	title: string;
	notes: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}) {
	return {
		id: todo.id,
		userId: todo.userId,
		title: todo.title,
		notes: todo.notes,
		status: todo.status,
		createdAt: todo.createdAt.toISOString(),
		updatedAt: todo.updatedAt.toISOString(),
	};
}

export async function listPersistedTodos(userId: string) {
	return db
		.select({
			id: todos.id,
			userId: todos.userId,
			title: todos.title,
			notes: todos.notes,
			status: todos.status,
			createdAt: todos.createdAt,
			updatedAt: todos.updatedAt,
		})
		.from(todos)
		.where(eq(todos.userId, userId))
		.orderBy(desc(todos.updatedAt), desc(todos.createdAt))
		.then((items) =>
			items.map((todo) =>
				serializeTodo({
					...todo,
					createdAt: todo.createdAt ?? new Date(),
					updatedAt: todo.updatedAt ?? new Date(),
				}),
			),
		);
}

export async function createPersistedTodo(input: {
	id: string;
	userId: string;
	title: string;
	notes: string;
	status: string;
}) {
	const [todo] = await db.insert(todos).values(input).returning({
		id: todos.id,
		userId: todos.userId,
		title: todos.title,
		notes: todos.notes,
		status: todos.status,
		createdAt: todos.createdAt,
		updatedAt: todos.updatedAt,
	});

	if (!todo) {
		return null;
	}

	return serializeTodo({
		...todo,
		createdAt: todo.createdAt ?? new Date(),
		updatedAt: todo.updatedAt ?? new Date(),
	});
}

export async function updatePersistedTodo(input: {
	id: string;
	userId: string;
	title?: string;
	notes?: string;
	status?: string;
}) {
	const { id, userId, ...changes } = input;

	const [todo] = await db
		.update(todos)
		.set({
			...changes,
			updatedAt: new Date(),
		})
		.where(and(eq(todos.id, id), eq(todos.userId, userId)))
		.returning({
			id: todos.id,
			userId: todos.userId,
			title: todos.title,
			notes: todos.notes,
			status: todos.status,
			createdAt: todos.createdAt,
			updatedAt: todos.updatedAt,
		});

	if (!todo) {
		return null;
	}

	return serializeTodo({
		...todo,
		createdAt: todo.createdAt ?? new Date(),
		updatedAt: todo.updatedAt ?? new Date(),
	});
}

export async function deletePersistedTodo(input: {
	id: string;
	userId: string;
}) {
	const [todo] = await db
		.delete(todos)
		.where(and(eq(todos.id, input.id), eq(todos.userId, input.userId)))
		.returning({
			id: todos.id,
		});

	return todo ?? null;
}
