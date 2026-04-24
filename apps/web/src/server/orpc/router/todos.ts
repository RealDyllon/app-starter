import { os } from "@orpc/server";
import * as z from "zod";

import { auth } from "#/server/auth";
import { createPersistedTodo, listPersistedTodos } from "#/server/todos";

const TodoInputSchema = z.object({
	name: z.string().trim().min(1).max(120),
});

type OrpcContext = {
	headers?: Headers;
};

async function getAuthenticatedUserId(context: OrpcContext | undefined) {
	if (!context?.headers) {
		throw new Error("Unauthorized");
	}

	const session = await auth.api.getSession({ headers: context.headers });

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	return session.user.id;
}

export async function listTodosHandler({ context }: { context?: OrpcContext }) {
	const userId = await getAuthenticatedUserId(context);

	return listPersistedTodos(userId);
}

export async function addTodoHandler({
	input,
	context,
}: {
	input: z.infer<typeof TodoInputSchema>;
	context?: OrpcContext;
}) {
	const userId = await getAuthenticatedUserId(context);

	return createPersistedTodo(input.name, userId);
}

export const listTodos = os.input(z.object({})).handler(listTodosHandler);

export const addTodo = os.input(TodoInputSchema).handler(addTodoHandler);
