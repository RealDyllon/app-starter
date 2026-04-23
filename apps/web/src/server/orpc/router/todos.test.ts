import { describe, expect, it, vi } from "vitest";

import { addTodoHandler, listTodosHandler } from "./todos";

vi.mock("#/server/todos", () => ({
	createPersistedTodo: vi.fn(),
	listPersistedTodos: vi.fn(),
}));

describe("todo handlers", async () => {
	const serverTodos = await import("#/server/todos");

	it("lists persisted todos", async () => {
		vi.mocked(serverTodos.listPersistedTodos).mockResolvedValueOnce([
			{ id: 1, name: "First todo" },
		]);

		await expect(listTodosHandler()).resolves.toEqual([
			{ id: 1, name: "First todo" },
		]);
	});

	it("creates a persisted todo", async () => {
		vi.mocked(serverTodos.createPersistedTodo).mockResolvedValueOnce({
			id: 2,
			name: "Second todo",
		});

		await expect(
			addTodoHandler({
				input: { name: "Second todo" },
			}),
		).resolves.toEqual({
			id: 2,
			name: "Second todo",
		});
	});
});
