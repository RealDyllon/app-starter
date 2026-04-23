import { call } from "@orpc/server";
import { describe, expect, it, vi } from "vitest";

import { addTodo, deleteTodo, listTodos, updateTodo } from "./todos";

vi.mock("#/server/auth/session", () => ({
	getSessionFromHeaders: vi.fn(),
}));

vi.mock("#/server/todos", () => ({
	createPersistedTodo: vi.fn(),
	deletePersistedTodo: vi.fn(),
	listPersistedTodos: vi.fn(),
	updatePersistedTodo: vi.fn(),
}));

const headers = new Headers();
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

describe("todo procedures", async () => {
	const authSession = await import("#/server/auth/session");
	const serverTodos = await import("#/server/todos");

	it("rejects unauthenticated requests", async () => {
		vi.mocked(authSession.getSessionFromHeaders).mockResolvedValueOnce(null);

		await expect(
			call(listTodos, {}, { context: { headers } }),
		).rejects.toHaveProperty("code", "UNAUTHORIZED");
	});

	it("lists todos for the signed-in user only", async () => {
		vi.mocked(authSession.getSessionFromHeaders).mockResolvedValueOnce(
			mockSession,
		);
		vi.mocked(serverTodos.listPersistedTodos).mockResolvedValueOnce([
			{
				id: "todo-1",
				userId: "user-1",
				title: "First todo",
				notes: "",
				status: "backlog",
				createdAt: "2026-04-23T00:00:00.000Z",
				updatedAt: "2026-04-23T00:00:00.000Z",
			},
		]);

		await expect(
			call(listTodos, {}, { context: { headers } }),
		).resolves.toEqual([
			{
				id: "todo-1",
				userId: "user-1",
				title: "First todo",
				notes: "",
				status: "backlog",
				createdAt: "2026-04-23T00:00:00.000Z",
				updatedAt: "2026-04-23T00:00:00.000Z",
			},
		]);

		expect(serverTodos.listPersistedTodos).toHaveBeenCalledWith("user-1");
	});

	it("creates a user-scoped todo with the current session user", async () => {
		vi.mocked(authSession.getSessionFromHeaders).mockResolvedValueOnce(
			mockSession,
		);
		vi.mocked(serverTodos.createPersistedTodo).mockResolvedValueOnce({
			id: "todo-2",
			userId: "user-1",
			title: "Second todo",
			notes: "Keep it private",
			status: "backlog",
			createdAt: "2026-04-23T01:00:00.000Z",
			updatedAt: "2026-04-23T01:00:00.000Z",
		});

		await expect(
			call(
				addTodo,
				{
					id: "todo-2",
					title: "Second todo",
					notes: "Keep it private",
					status: "backlog",
				},
				{ context: { headers } },
			),
		).resolves.toEqual({
			id: "todo-2",
			userId: "user-1",
			title: "Second todo",
			notes: "Keep it private",
			status: "backlog",
			createdAt: "2026-04-23T01:00:00.000Z",
			updatedAt: "2026-04-23T01:00:00.000Z",
		});

		expect(serverTodos.createPersistedTodo).toHaveBeenCalledWith({
			id: "todo-2",
			userId: "user-1",
			title: "Second todo",
			notes: "Keep it private",
			status: "backlog",
		});
	});

	it("updates a todo owned by the current user", async () => {
		vi.mocked(authSession.getSessionFromHeaders).mockResolvedValueOnce(
			mockSession,
		);
		vi.mocked(serverTodos.updatePersistedTodo).mockResolvedValueOnce({
			id: "todo-3",
			userId: "user-1",
			title: "Updated title",
			notes: "Updated notes",
			status: "done",
			createdAt: "2026-04-23T02:00:00.000Z",
			updatedAt: "2026-04-23T02:05:00.000Z",
		});

		await expect(
			call(
				updateTodo,
				{
					id: "todo-3",
					title: "Updated title",
					notes: "Updated notes",
					status: "done",
				},
				{ context: { headers } },
			),
		).resolves.toMatchObject({
			id: "todo-3",
			userId: "user-1",
			status: "done",
		});

		expect(serverTodos.updatePersistedTodo).toHaveBeenCalledWith({
			id: "todo-3",
			userId: "user-1",
			title: "Updated title",
			notes: "Updated notes",
			status: "done",
		});
	});

	it("rejects updates for missing todos", async () => {
		vi.mocked(authSession.getSessionFromHeaders).mockResolvedValueOnce(
			mockSession,
		);
		vi.mocked(serverTodos.updatePersistedTodo).mockResolvedValueOnce(null);

		await expect(
			call(
				updateTodo,
				{
					id: "missing-todo",
					status: "done",
				},
				{ context: { headers } },
			),
		).rejects.toHaveProperty("code", "NOT_FOUND");
	});

	it("deletes a todo owned by the current user", async () => {
		vi.mocked(authSession.getSessionFromHeaders).mockResolvedValueOnce(
			mockSession,
		);
		vi.mocked(serverTodos.deletePersistedTodo).mockResolvedValueOnce({
			id: "todo-4",
		});

		await expect(
			call(deleteTodo, { id: "todo-4" }, { context: { headers } }),
		).resolves.toEqual({
			id: "todo-4",
		});

		expect(serverTodos.deletePersistedTodo).toHaveBeenCalledWith({
			id: "todo-4",
			userId: "user-1",
		});
	});
});
