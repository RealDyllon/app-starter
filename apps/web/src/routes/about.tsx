import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="app-shell">
			<section className="page-wrap">
				<nav aria-label="Primary" className="page-nav">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/about" className="nav-link">
						About
					</Link>
				</nav>

				<section className="hello-card">
					<p className="hello-label">About</p>
					<h1>What this starter now covers end to end.</h1>
					<p>
						The goal is a truthful baseline: shared layout, auth entry points, a
						persistent data example, and the core docs to extend it safely.
					</p>

					<ul className="about-list">
						<li>
							TanStack Start routes with a mounted global header and footer.
						</li>
						<li>oRPC procedures consumed via TanStack Query utilities.</li>
						<li>Drizzle + PostgreSQL for the server-side todo slice.</li>
						<li>Better Auth wired to the same database connection.</li>
					</ul>

					<div className="cta-row">
						<Link to="/todos" className="inline-cta">
							Explore the todo example
						</Link>
						<Link to="/" className="nav-link">
							Back to home
						</Link>
					</div>
				</section>
			</section>
		</main>
	);
}
