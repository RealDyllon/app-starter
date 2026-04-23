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
	m: {
		language_label: () => "Language",
		current_locale: ({ locale }: { locale: string }) => `Current locale: ${locale}`,
	},
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
