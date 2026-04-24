import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { QueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "#/lib/orpc-client";
import { TodoStatusSchema } from "#/lib/todo-schema";

export const TodoCollectionSchema = z.object({
	id: z
		.string()
		.min(1)
		.default(() => crypto.randomUUID()),
	userId: z.string().default(""),
	title: z.string().trim().min(1).max(120),
	notes: z.string().trim().max(500).default(""),
	status: TodoStatusSchema.default("backlog"),
	createdAt: z.string().default(() => new Date().toISOString()),
	updatedAt: z.string().default(() => new Date().toISOString()),
});

export type TodoRecord = z.infer<typeof TodoCollectionSchema>;
export type TodoStatus = z.infer<typeof TodoStatusSchema>;

const collectionQueryClient = new QueryClient();

export const todoCollection = createCollection(
	queryCollectionOptions({
		queryKey: ["user-todos"],
		queryFn: async () => client.listTodos({}),
		queryClient: collectionQueryClient,
		schema: TodoCollectionSchema,
		getKey: (todo) => todo.id,
		onInsert: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((mutation) =>
					client.addTodo({
						id: mutation.modified.id,
						title: mutation.modified.title,
						notes: mutation.modified.notes,
						status: mutation.modified.status,
					}),
				),
			);
		},
		onUpdate: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const changes = mutation.changes as Partial<TodoRecord>;

					if (
						changes.title === undefined &&
						changes.notes === undefined &&
						changes.status === undefined
					) {
						return Promise.resolve();
					}

					return client.updateTodo({
						id: String(mutation.key),
						...(changes.title !== undefined ? { title: changes.title } : {}),
						...(changes.notes !== undefined ? { notes: changes.notes } : {}),
						...(changes.status !== undefined ? { status: changes.status } : {}),
					});
				}),
			);
		},
		onDelete: async ({ transaction }) => {
			await Promise.all(
				transaction.mutations.map((mutation) =>
					client.deleteTodo({
						id: String(mutation.key),
					}),
				),
			);
		},
	}),
);
