import { z } from "zod";

export const todoStatuses = ["backlog", "in_progress", "done"] as const;

export type TodoStatus = (typeof todoStatuses)[number];

export const TodoStatusSchema = z.enum(todoStatuses);

export const TodoSchema = z.object({
	id: z.string().min(1),
	userId: z.string().min(1),
	title: z.string().min(1).max(120),
	notes: z.string().max(500),
	status: TodoStatusSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
});
