import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
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
          <p className="hello-label">Starter App</p>
          <h1>Build from a stronger baseline.</h1>
          <p>
            This sample home page now has a clearer structure, a small feature
            overview, and route links you can reuse as you flesh the app out.
          </p>

          <div className="feature-grid">
            <article>
              <h2>Routing</h2>
              <p>File routes stay simple while navigation remains type-safe.</p>
            </article>
            <article>
              <h2>Data</h2>
              <p>React Query and SSR utilities are ready when you need them.</p>
            </article>
            <article>
              <h2>Auth + API</h2>
              <p>oRPC and Better Auth are already wired into the app shell.</p>
            </article>
          </div>

          <Link to="/about" className="inline-cta">
            Learn more about this starter
          </Link>
        </section>
      </section>
    </main>
  )
}
