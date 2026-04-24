import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

export const Route = createFileRoute("/examples/store")({
	component: StoreExample,
});

type WorkspaceState = {
	activeProject: string;
	notifications: number;
	compactMode: boolean;
};

const workspaceStore = new Store<WorkspaceState>({
	activeProject: "Operations Hub",
	notifications: 3,
	compactMode: false,
});

function StoreExample() {
	const activeProject = useSelector(
		workspaceStore,
		(state) => state.activeProject,
	);
	const notifications = useSelector(
		workspaceStore,
		(state) => state.notifications,
	);
	const compactMode = useSelector(workspaceStore, (state) => state.compactMode);

	return (
		<main className="app-shell">
			<section className="page-wrap">
				<nav aria-label="Examples" className="page-nav">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/examples/form" className="nav-link">
						Form
					</Link>
					<Link to="/examples/table" className="nav-link">
						Table
					</Link>
					<Link to="/examples/store" className="nav-link">
						Store
					</Link>
				</nav>

				<section className="hello-card">
					<p className="hello-label">TanStack Store</p>
					<h1>Shared workspace state</h1>
					<p>
						A small global store for UI preferences and cross-route state. The
						selectors below subscribe to individual state slices.
					</p>

					<div className="store-grid">
						<article>
							<span>Active project</span>
							<strong>{activeProject}</strong>
						</article>
						<article>
							<span>Notifications</span>
							<strong>{notifications}</strong>
						</article>
						<article>
							<span>Density</span>
							<strong>{compactMode ? "Compact" : "Comfortable"}</strong>
						</article>
					</div>

					<div className="form-actions">
						<button
							type="button"
							className="inline-cta"
							onClick={() =>
								workspaceStore.setState((state) => ({
									...state,
									notifications: state.notifications + 1,
								}))
							}
						>
							Add notification
						</button>
						<button
							type="button"
							className="nav-link"
							onClick={() =>
								workspaceStore.setState((state) => ({
									...state,
									compactMode: !state.compactMode,
								}))
							}
						>
							Toggle density
						</button>
						<button
							type="button"
							className="nav-link"
							onClick={() =>
								workspaceStore.setState((state) => ({
									...state,
									activeProject:
										state.activeProject === "Operations Hub"
											? "Partner Portal"
											: "Operations Hub",
								}))
							}
						>
							Switch project
						</button>
					</div>
				</section>
			</section>
		</main>
	);
}
