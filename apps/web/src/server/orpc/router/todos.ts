import { ORPCError } from "@orpc/server";
import * as z from "zod";

import { todoStatuses } from "#/server/db/schema";
import { protectedProcedure } from "#/server/orpc/base";
import {
	createPersistedTodo,
	deletePersistedTodo,
	listPersistedTodos,
	updatePersistedTodo,
} from "#/server/todos";

const TodoStatusSchema = z.enum(todoStatuses);

const CreateTodoInputSchema = z.object({
	id: z.string().trim().min(1).max(120).optional(),
	title: z.string().trim().min(1).max(120),
	notes: z.string().trim().max(500).default(""),
	status: TodoStatusSchema.default("backlog"),
});

const UpdateTodoInputSchema = z
	.object({
		id: z.string().trim().min(1).max(120),
		title: z.string().trim().min(1).max(120).optional(),
		notes: z.string().trim().max(500).optional(),
		status: TodoStatusSchema.optional(),
	})
	.refine(
		(input) =>
			input.title !== undefined ||
			input.notes !== undefined ||
			input.status !== undefined,
		{
			message: "At least one field must be updated.",
		},
	);

const DeleteTodoInputSchema = z.object({
	id: z.string().trim().min(1).max(120),
});

type ProtectedContext = {
	context: {
		session: {
			user: {
				id: string;
			};
		};
	};
};

export async function listTodosHandler({ context }: ProtectedContext) {
	return listPersistedTodos(context.session.user.id);
}

export async function addTodoHandler({
	input,
	context,
}: {
	input: z.infer<typeof CreateTodoInputSchema>;
} & ProtectedContext) {
	return createPersistedTodo({
		id: input.id ?? crypto.randomUUID(),
		userId: context.session.user.id,
		title: input.title,
		notes: input.notes,
		status: input.status,
	});
}

export async function updateTodoHandler({
	input,
	context,
}: {
	input: z.infer<typeof UpdateTodoInputSchema>;
} & ProtectedContext) {
	const todo = await updatePersistedTodo({
		id: input.id,
		userId: context.session.user.id,
		title: input.title,
		notes: input.notes,
		status: input.status,
	});

	if (!todo) {
		throw new ORPCError("NOT_FOUND", {
			message: "Todo not found.",
		});
	}

	return todo;
}

export async function deleteTodoHandler({
	input,
	context,
}: {
	input: z.infer<typeof DeleteTodoInputSchema>;
} & ProtectedContext) {
	const deleted = await deletePersistedTodo({
		id: input.id,
		userId: context.session.user.id,
	});

	if (!deleted) {
		throw new ORPCError("NOT_FOUND", {
			message: "Todo not found.",
		});
	}

	return deleted;
}

export const listTodos = protectedProcedure
	.input(z.object({}))
	.handler(listTodosHandler);

export const addTodo = protectedProcedure
	.input(CreateTodoInputSchema)
	.handler(addTodoHandler);

export const updateTodo = protectedProcedure
	.input(UpdateTodoInputSchema)
	.handler(updateTodoHandler);

export const deleteTodo = protectedProcedure
	.input(DeleteTodoInputSchema)
	.handler(deleteTodoHandler);
