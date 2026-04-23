import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "#/app/providers/devtools";
import appCss from "#/app/styles.css?url";
import AppShell from "#/components/AppShell";
import { getLocale } from "#/i18n/runtime";
import { env } from "#/lib/env";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		// Other redirect strategies are possible; see
		// https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: env.VITE_APP_TITLE ?? "app-starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
	notFoundComponent: RootNotFound,
	shellComponent: RootDocument,
});

function RootComponent() {
	return (
		<AppShell>
			<Outlet />
		</AppShell>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased">
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function RootNotFound() {
	return (
		<AppShell>
			<main className="app-shell">
				<section className="page-wrap">
					<section className="hello-card not-found-card">
						<p className="hello-label">404</p>
						<h1>Page not found.</h1>
						<p>
							The route you requested does not exist or is no longer available.
						</p>

						<div className="not-found-actions">
							<Link to="/" className="inline-cta">
								Return home
							</Link>
							<Link to="/about" className="nav-link">
								Open about page
							</Link>
						</div>
					</section>
				</section>
			</main>
		</AppShell>
	);
}
