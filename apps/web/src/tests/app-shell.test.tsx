import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import AppShell from "#/components/AppShell";

vi.mock("#/lib/auth-client", () => ({
	authClient: {
		useSession: () => ({
			data: null,
			isPending: false,
		}),
		signOut: vi.fn(),
	},
}));

vi.mock("#/i18n/runtime", () => ({
	getLocale: () => "en",
	locales: ["en", "de"],
	setLocale: vi.fn(),
}));

vi.mock("#/i18n/messages", () => ({
	m: new Proxy(
		{
			language_label: () => "Language",
			current_locale: ({ locale }: { locale: string }) =>
				`Current locale: ${locale}`,
			header_brand: () => "TanStack Start",
			auth_log_in: () => "Log in",
			auth_sign_up: () => "Sign up",
			footer_built_with: () => "Built with TanStack Start",
			theme_toggle_auto_label: () =>
				"Theme mode: auto (system). Click to switch to light mode.",
			theme_toggle_auto: () => "Auto",
			link_follow_tanstack_x: () => "Follow TanStack on X",
			link_open_tanstack_github: () => "Go to TanStack GitHub",
			nav_home: () => "Home",
			nav_about: () => "About",
			nav_todos: () => "Todos",
			nav_docs: () => "Docs",
			footer_copyright: () => "copyright",
			auth_user_fallback_initial: () => "U",
		},
		{
			get: (target, prop: string) =>
				target[prop as keyof typeof target] ?? (() => prop),
		},
	),
}));

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		to,
		activeProps,
		...props
	}: React.ComponentProps<"a"> & {
		to: string;
		activeProps?: unknown;
	}) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

describe("AppShell", () => {
	it("renders the shared shell with signed-out auth actions", () => {
		const markup = renderToStaticMarkup(
			<AppShell>
				<main>Home content</main>
			</AppShell>,
		);

		expect(markup).toContain("TanStack Start");
		expect(markup).toContain("Log in");
		expect(markup).toContain("Sign up");
		expect(markup).toContain("Built with TanStack Start");
		expect(markup).toContain(
			"Theme mode: auto (system). Click to switch to light mode.",
		);
	});
});
