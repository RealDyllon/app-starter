import { describe, expect, it, vi } from "vitest";

import { addTodoHandler, listTodosHandler } from "./todos";

vi.mock("#/server/todos", () => ({
	createPersistedTodo: vi.fn(),
	listPersistedTodos: vi.fn(),
}));
vi.mock("#/server/auth", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
}));

describe("todo handlers", async () => {
	const serverTodos = await import("#/server/todos");
	const serverAuth = await import("#/server/auth");
	const mockSession = {
		session: {
			id: "session-1",
			createdAt: new Date("2026-04-23T00:00:00.000Z"),
			updatedAt: new Date("2026-04-23T00:00:00.000Z"),
			userId: "user-1",
			expiresAt: new Date("2026-04-24T00:00:00.000Z"),
			token: "session-token",
		},
		user: {
			id: "user-1",
			name: "Test User",
			email: "test@example.com",
			emailVerified: false,
			createdAt: new Date("2026-04-23T00:00:00.000Z"),
			updatedAt: new Date("2026-04-23T00:00:00.000Z"),
		},
	};

	it("lists persisted todos", async () => {
		vi.mocked(serverAuth.auth.api.getSession).mockResolvedValue(mockSession);

		vi.mocked(serverTodos.listPersistedTodos).mockResolvedValueOnce([
			{ id: 1, name: "First todo" },
		]);

		await expect(
			listTodosHandler({
				context: { headers: new Headers() },
			}),
		).resolves.toEqual([{ id: 1, name: "First todo" }]);
	});

	it("creates a persisted todo", async () => {
		vi.mocked(serverAuth.auth.api.getSession).mockResolvedValue(mockSession);

		vi.mocked(serverTodos.createPersistedTodo).mockResolvedValueOnce({
			id: 2,
			name: "Second todo",
		});

		await expect(
			addTodoHandler({
				input: { name: "Second todo" },
				context: { headers: new Headers() },
			}),
		).resolves.toEqual({
			id: 2,
			name: "Second todo",
		});
	});
});
