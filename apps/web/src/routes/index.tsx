import { createFileRoute, Link } from "@tanstack/react-router";
import { m } from "#/i18n/messages";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<main className="app-shell">
			<section className="page-wrap">
				<section className="hello-card">
					<p className="hello-label">{m.home_label()}</p>
					<h1>{m.home_title()}</h1>
					<p>{m.home_description()}</p>

					<div className="feature-grid">
						<article>
							<h2>{m.home_feature_shell_title()}</h2>
							<p>{m.home_feature_shell_description()}</p>
						</article>
						<article>
							<h2>{m.home_feature_data_title()}</h2>
							<p>{m.home_feature_data_description()}</p>
						</article>
						<article>
							<h2>{m.home_feature_auth_title()}</h2>
							<p>{m.home_feature_auth_description()}</p>
						</article>
					</div>

					<div className="cta-row">
						<Link to="/todos" className="inline-cta">
							{m.home_primary_cta()}
						</Link>
						<Link to="/signup" className="nav-link">
							{m.home_secondary_cta()}
						</Link>
					</div>
				</section>
			</section>
		</main>
	);
}
