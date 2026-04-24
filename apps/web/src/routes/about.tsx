import { createFileRoute, Link } from "@tanstack/react-router";
import { m } from "#/i18n/messages";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="app-shell">
			<section className="page-wrap">
				<nav aria-label="Primary" className="page-nav">
					<Link to="/" className="nav-link">
						{m.nav_home()}
					</Link>
					<Link to="/about" className="nav-link">
						{m.nav_about()}
					</Link>
				</nav>

				<section className="hello-card">
					<p className="hello-label">{m.about_label()}</p>
					<h1>{m.about_title()}</h1>
					<p>{m.about_description()}</p>

					<ul className="about-list">
						<li>{m.about_item_shell()}</li>
						<li>{m.about_item_orpc()}</li>
						<li>{m.about_item_db()}</li>
						<li>{m.about_item_auth()}</li>
					</ul>

					<div className="cta-row">
						<Link to="/todos" className="inline-cta">
							{m.about_primary_cta()}
						</Link>
						<Link to="/" className="nav-link">
							{m.about_secondary_cta()}
						</Link>
					</div>
				</section>
			</section>
		</main>
	);
}
