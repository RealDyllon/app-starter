import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { sanitizeRedirectTarget } from "#/components/AuthCard";
import { m } from "#/i18n/messages";
import { authClient } from "#/lib/auth-client";
import {
	type TodoRecord,
	type TodoStatus,
	todoCollection,
} from "#/lib/tanstack-db";

type TodoFilter = "all" | TodoStatus;

const statusOptions: TodoStatus[] = ["backlog", "in_progress", "done"];

export const Route = createFileRoute("/todos")({
	ssr: false,
	loader: async ({ location }) => {
		const { data: session } = await authClient.getSession();

		if (!session) {
			const redirectTarget = sanitizeRedirectTarget(location.href) ?? "/todos";

			throw redirect({
				to: "/login",
				search: {
					redirect: redirectTarget,
				},
			});
		}

		await todoCollection.preload();
	},
	component: TodosPage,
});

function formatTodoDate(timestamp: string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(timestamp));
}

function getStatusLabel(status: TodoStatus) {
	switch (status) {
		case "backlog":
			return m.todo_status_backlog();
		case "in_progress":
			return m.todo_status_in_progress();
		case "done":
			return m.todo_status_done();
	}
}

function getFilterLabel(filter: TodoFilter) {
	if (filter === "all") {
		return m.todos_filter_all();
	}

	return getStatusLabel(filter);
}

function TodosPage() {
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<TodoFilter>("all");
	const deferredSearch = useDeferredValue(search.trim().toLowerCase());

	const allTodosQuery = useLiveQuery((query) =>
		query
			.from({ todo: todoCollection })
			.orderBy(({ todo }) => todo.updatedAt, "desc"),
	);

	const filteredTodosQuery = useLiveQuery(
		(query) => {
			const baseQuery = query.from({ todo: todoCollection });

			if (statusFilter === "all") {
				return baseQuery.orderBy(({ todo }) => todo.updatedAt, "desc");
			}

			return baseQuery
				.where(({ todo }) => eq(todo.status, statusFilter))
				.orderBy(({ todo }) => todo.updatedAt, "desc");
		},
		[statusFilter],
	);

	const allTodos = allTodosQuery.data ?? [];
	const visibleTodos = (filteredTodosQuery.data ?? []).filter((todo) => {
		if (!deferredSearch) {
			return true;
		}

		return [todo.title, todo.notes]
			.join(" ")
			.toLowerCase()
			.includes(deferredSearch);
	});

	const counts = {
		total: allTodos.length,
		backlog: allTodos.filter((todo) => todo.status === "backlog").length,
		inProgress: allTodos.filter((todo) => todo.status === "in_progress").length,
		done: allTodos.filter((todo) => todo.status === "done").length,
	};

	function handleCreateTodo(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const nextTitle = title.trim();

		if (!nextTitle) {
			return;
		}

		startTransition(() => {
			todoCollection.insert({
				title: nextTitle,
				...(notes.trim() ? { notes: notes.trim() } : {}),
			});
		});

		setTitle("");
		setNotes("");
	}

	function handleStatusChange(todoId: string, status: TodoStatus) {
		startTransition(() => {
			todoCollection.update(todoId, (draft) => {
				draft.status = status;
				draft.updatedAt = new Date().toISOString();
			});
		});
	}

	function handleNotesSave(todoId: string, nextNotes: string) {
		startTransition(() => {
			todoCollection.update(todoId, (draft) => {
				draft.notes = nextNotes.trim();
				draft.updatedAt = new Date().toISOString();
			});
		});
	}

	function handleDelete(todoId: string) {
		startTransition(() => {
			todoCollection.delete(todoId);
		});
	}

	if (allTodosQuery.isError) {
		return (
			<main className="app-shell">
				<section className="page-wrap">
					<section className="hello-card">
						<p className="hello-label">{m.todos_label()}</p>
						<h1>{m.todos_error_title()}</h1>
						<p>{m.todos_error_description()}</p>

						<div className="cta-row">
							<Link
								to="/login"
								search={{ redirect: "/todos" }}
								className="inline-cta"
							>
								{m.auth_login_submit()}
							</Link>
							<Link to="/" className="nav-link">
								{m.nav_home()}
							</Link>
						</div>
					</section>
				</section>
			</main>
		);
	}

	return (
		<main className="app-shell">
			<section className="page-wrap">
				<section className="hello-card">
					<p className="hello-label">{m.todos_label()}</p>
					<h1>{m.todos_title()}</h1>
					<p>{m.todos_description()}</p>

					<section className="feature-grid">
						<article>
							<h2>{m.todos_stat_total_title()}</h2>
							<p>{m.todos_stat_total_value({ count: counts.total })}</p>
						</article>
						<article>
							<h2>{m.todo_status_backlog()}</h2>
							<p>{m.todos_stat_status_value({ count: counts.backlog })}</p>
						</article>
						<article>
							<h2>{m.todo_status_in_progress()}</h2>
							<p>{m.todos_stat_status_value({ count: counts.inProgress })}</p>
						</article>
						<article>
							<h2>{m.todo_status_done()}</h2>
							<p>{m.todos_stat_status_value({ count: counts.done })}</p>
						</article>
					</section>

					<form className="stack-form" onSubmit={handleCreateTodo}>
						<label className="form-field">
							<span>{m.todos_form_title_label()}</span>
							<input
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder={m.todos_form_title_placeholder()}
								required
							/>
						</label>

						<label className="form-field">
							<span>{m.todos_form_notes_label()}</span>
							<textarea
								value={notes}
								onChange={(event) => setNotes(event.target.value)}
								placeholder={m.todos_form_notes_placeholder()}
								rows={3}
							/>
						</label>

						<div className="form-actions">
							<button className="inline-cta m-0 cursor-pointer" type="submit">
								{m.todos_form_submit()}
							</button>
							<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
								{m.todos_form_hint()}
							</p>
						</div>
					</form>

					<section className="stack-form">
						<label className="form-field">
							<span>{m.todos_search_label()}</span>
							<input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder={m.todos_search_placeholder()}
							/>
						</label>

						<div className="flex flex-wrap gap-2">
							{(["all", ...statusOptions] as const).map((filterValue) => (
								<button
									key={filterValue}
									type="button"
									onClick={() => setStatusFilter(filterValue)}
									aria-pressed={statusFilter === filterValue}
									className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:-translate-y-0.5"
								>
									{getFilterLabel(filterValue)}
								</button>
							))}
						</div>
					</section>

					<section className="todo-list">
						{allTodosQuery.isLoading ? (
							<p className="empty-state">{m.todos_loading()}</p>
						) : visibleTodos.length ? (
							visibleTodos.map((todo) => (
								<TodoCard
									key={todo.id}
									todo={todo}
									onDelete={handleDelete}
									onNotesSave={handleNotesSave}
									onStatusChange={handleStatusChange}
								/>
							))
						) : (
							<p className="empty-state">{m.todos_empty_state()}</p>
						)}
					</section>
				</section>
			</section>
		</main>
	);
}

function TodoCard({
	todo,
	onStatusChange,
	onNotesSave,
	onDelete,
}: {
	todo: TodoRecord;
	onStatusChange: (todoId: string, status: TodoStatus) => void;
	onNotesSave: (todoId: string, notes: string) => void;
	onDelete: (todoId: string) => void;
}) {
	const [notesDraft, setNotesDraft] = useState(todo.notes);

	useEffect(() => {
		setNotesDraft(todo.notes);
	}, [todo.notes]);

	return (
		<article className="todo-item flex flex-col gap-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<strong>{todo.title}</strong>
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						{m.todos_card_updated({
							timestamp: formatTodoDate(todo.updatedAt),
						})}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<label className="text-sm font-semibold text-[var(--sea-ink)]">
						<span className="sr-only">{m.todos_card_status_label()}</span>
						<select
							className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)]"
							value={todo.status}
							onChange={(event) =>
								onStatusChange(todo.id, event.target.value as TodoStatus)
							}
						>
							{statusOptions.map((status) => (
								<option key={status} value={status}>
									{getStatusLabel(status)}
								</option>
							))}
						</select>
					</label>

					<button
						type="button"
						onClick={() => onDelete(todo.id)}
						className="nav-link border-0 bg-transparent p-0"
					>
						{m.todos_card_delete()}
					</button>
				</div>
			</div>

			<label className="form-field">
				<span>{m.todos_form_notes_label()}</span>
				<textarea
					value={notesDraft}
					onChange={(event) => setNotesDraft(event.target.value)}
					rows={3}
				/>
			</label>

			<div className="form-actions">
				<button
					type="button"
					className="inline-cta m-0 cursor-pointer"
					onClick={() => onNotesSave(todo.id, notesDraft)}
				>
					{m.todos_card_save_notes()}
				</button>
			</div>
		</article>
	);
}
