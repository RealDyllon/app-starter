import { z } from "zod";

import { todoStatuses } from "#/server/db/schema";

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
