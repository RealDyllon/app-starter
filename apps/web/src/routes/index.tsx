import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<main className="app-shell">
			<section className="page-wrap">
				<section className="hello-card">
					<p className="hello-label">Starter Baseline</p>
					<h1>Ship from a starter that actually exercises the stack.</h1>
					<p>
						This baseline now includes a shared app shell, real auth entry
						routes, and a persistent todo slice wired through oRPC, Query, and
						Drizzle.
					</p>

					<div className="feature-grid">
						<article>
							<h2>Shared shell</h2>
							<p>
								Theme, locale, navigation, and auth state live in one place.
							</p>
						</article>
						<article>
							<h2>Persistent data</h2>
							<p>
								Todos now come from PostgreSQL instead of an in-memory array.
							</p>
						</article>
						<article>
							<h2>Working auth</h2>
							<p>Sign up and sign in routes are ready for local development.</p>
						</article>
					</div>

					<div className="cta-row">
						<Link to="/todos" className="inline-cta">
							Open the todo slice
						</Link>
						<Link to="/signup" className="nav-link">
							Create an account
						</Link>
					</div>
				</section>
			</section>
		</main>
	);
}
