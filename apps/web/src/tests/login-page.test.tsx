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
});
