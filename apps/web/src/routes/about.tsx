import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

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
          <h1>What this project gives you out of the box.</h1>
          <p>
            The web app ships with a TanStack-first stack, server APIs, and
            baseline tooling so you can focus on product work instead of setup.
          </p>

          <ul className="about-list">
            <li>TanStack Start with file-based routing and SSR support.</li>
            <li>Query integration for data fetching and caching.</li>
            <li>Drizzle + PostgreSQL setup for the server data layer.</li>
            <li>Auth and API primitives ready for feature development.</li>
          </ul>

          <Link to="/" className="inline-cta">
            Back to home
          </Link>
        </section>
      </section>
    </main>
  )
}
