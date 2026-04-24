import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import AuthCardView from "#/components/AuthCardView";

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		to,
		...props
	}: React.ComponentProps<"a"> & { to: string }) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));

vi.mock("#/i18n/messages", () => ({
	m: new Proxy(
		{
			auth_login_eyebrow: () => "Welcome back",
			auth_login_title: () =>
				"Sign in to keep working from the starter baseline.",
			auth_login_description: () =>
				"Use Better Auth with the colocated `/api/auth` route and the shared Postgres connection.",
			auth_login_submit: () => "Sign in",
			auth_login_alternate: () => "Create an account",
			auth_signup_eyebrow: () => "Create account",
			auth_signup_title: () => "Create a local account backed by Better Auth.",
			auth_signup_description: () =>
				"This route gives the starter a working auth entrypoint instead of a disconnected session widget.",
			auth_signup_submit: () => "Create account",
			auth_signup_alternate: () => "Already have an account?",
			auth_name_label: () => "Name",
			auth_name_placeholder: () => "Starter User",
			auth_email_label: () => "Email",
			auth_email_placeholder: () => "you@example.com",
			auth_password_label: () => "Password",
			auth_password_placeholder: () => "At least 8 characters",
			auth_working: () => "Working…",
		},
		{
			get: (target, prop: string) =>
				target[prop as keyof typeof target] ?? (() => prop),
		},
	),
}));

describe("AuthCardView", () => {
	it("renders the sign-in form shell", () => {
		const markup = renderToStaticMarkup(
			<AuthCardView
				mode="login"
				name=""
				email=""
				password=""
				isPending={false}
				error={null}
				onNameChange={vi.fn()}
				onEmailChange={vi.fn()}
				onPasswordChange={vi.fn()}
				onSubmit={vi.fn()}
			/>,
		);

		expect(markup).toContain(
			"Sign in to keep working from the starter baseline.",
		);
		expect(markup).toContain("Email");
		expect(markup).toContain("Password");
		expect(markup).toContain("Sign in");
	});

	it("renders the sign-up form shell", () => {
		const markup = renderToStaticMarkup(
			<AuthCardView
				mode="signup"
				name=""
				email=""
				password=""
				isPending={false}
				error={null}
				onNameChange={vi.fn()}
				onEmailChange={vi.fn()}
				onPasswordChange={vi.fn()}
				onSubmit={vi.fn()}
			/>,
		);

		expect(markup).toContain("Create a local account backed by Better Auth.");
		expect(markup).toContain("Name");
		expect(markup).toContain("Create account");
	});
});
