import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/lib/auth-client";
import { orpc } from "#/lib/orpc-client";

function isUnauthorizedError(error: unknown) {
	return error instanceof Error && error.message === "Unauthorized";
}

export const Route = createFileRoute("/todos")({
	loader: async ({ context }) => {
		try {
			await context.queryClient.ensureQueryData(
				orpc.listTodos.queryOptions({
					input: {},
				}),
			);
		} catch (error) {
			if (!isUnauthorizedError(error)) {
				throw error;
			}
		}
	},
	component: TodosPage,
});

function TodosPage() {
	const queryClient = useQueryClient();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const todosQuery = useQuery({
		...orpc.listTodos.queryOptions({
			input: {},
		}),
		enabled: !!session?.user,
	});
	const addTodo = useMutation(
		orpc.addTodo.mutationOptions({
			onSuccess: async () => {
				setName("");
				setError(null);
				await queryClient.invalidateQueries({
					queryKey: orpc.listTodos.queryKey({
						input: {},
					}),
				});
			},
		}),
	);

	if (isSessionPending) {
		return (
			<main className="app-shell">
				<section className="page-wrap">
					<section className="hello-card">
						<p className="hello-label">Todo Slice</p>
						<h1>Loading your workspace…</h1>
					</section>
				</section>
			</main>
		);
	}

	if (!session?.user) {
		return (
			<main className="app-shell">
				<section className="page-wrap">
					<section className="hello-card">
						<p className="hello-label">Todo Slice</p>
						<h1>Sign in to access your todos.</h1>
						<p>
							Todos are now scoped to the signed-in user, so this route only
							loads persisted records after authentication.
						</p>

						<div className="not-found-actions">
							<Link to="/login" className="inline-cta">
								Log in
							</Link>
							<Link to="/signup" className="nav-link">
								Create account
							</Link>
						</div>
					</section>
				</section>
			</main>
		);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		try {
			await addTodo.mutateAsync({
				name,
			});
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Unable to create todo.",
			);
		}
	}

	return (
		<main className="app-shell">
			<section className="page-wrap">
				<section className="hello-card">
					<p className="hello-label">Todo Slice</p>
					<h1>
						Reference feature: routing, oRPC, Query, and Drizzle in one flow.
					</h1>
					<p>
						This page is the starter’s working vertical slice. Route loading
						primes Query, mutations run through oRPC, and the data persists in
						PostgreSQL.
					</p>

					<form className="stack-form" onSubmit={handleSubmit}>
						<label className="form-field">
							<span>New todo</span>
							<input
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="Wire up a feature from the starter"
								required
							/>
						</label>

						{error ? <p className="form-error">{error}</p> : null}

						<button className="inline-cta m-0 cursor-pointer" type="submit">
							{addTodo.isPending ? "Saving…" : "Add todo"}
						</button>
					</form>

					<section className="todo-list">
						{todosQuery.isLoading ? (
							<p className="empty-state">Loading todos…</p>
						) : todosQuery.data?.length ? (
							todosQuery.data.map((todo) => (
								<article key={todo.id} className="todo-item">
									<strong>{todo.name}</strong>
									<span>#{todo.id}</span>
								</article>
							))
						) : (
							<p className="empty-state">
								No todos yet. Create the first persisted record from this
								starter.
							</p>
						)}
					</section>
				</section>
			</section>
		</main>
	);
}
