import { os } from "@orpc/server";
import * as z from "zod";

import { createPersistedTodo, listPersistedTodos } from "#/server/todos";

const TodoInputSchema = z.object({
	name: z.string().trim().min(1).max(120),
});

export async function listTodosHandler() {
	return listPersistedTodos();
}

export async function addTodoHandler({
	input,
}: {
	input: z.infer<typeof TodoInputSchema>;
}) {
	return createPersistedTodo(input.name);
}

export const listTodos = os.input(z.object({})).handler(listTodosHandler);

export const addTodo = os.input(TodoInputSchema).handler(addTodoHandler);
