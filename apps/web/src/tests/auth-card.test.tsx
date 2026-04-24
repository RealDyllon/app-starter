import type { FormEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigate, signInEmail, signUpEmail, useStateMock } = vi.hoisted(() => ({
	navigate: vi.fn(),
	signInEmail: vi.fn(),
	signUpEmail: vi.fn(),
	useStateMock: vi.fn(),
}));

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();

	return {
		...actual,
		useState: useStateMock,
	};
});

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => navigate,
}));

vi.mock("#/lib/auth-client", () => ({
	authClient: {
		signIn: {
			email: signInEmail,
		},
		signUp: {
			email: signUpEmail,
		},
	},
}));

vi.mock("#/components/AuthCardView", () => ({
	default: (props: unknown) => ({
		type: "mock-auth-card-view",
		props,
	}),
}));

vi.mock("#/i18n/messages", () => ({
	m: new Proxy(
		{
			auth_generic_error: () => "Something went wrong. Please try again.",
			auth_failed: () => "Authentication failed.",
		},
		{
			get: (target, prop: string) =>
				target[prop as keyof typeof target] ?? (() => prop),
		},
	),
}));

type SubmitElement = {
	props: {
		onSubmit: (
			event: Pick<FormEvent<HTMLFormElement>, "preventDefault">,
		) => Promise<void>;
	};
};

function mockState(values: {
	name?: string;
	email: string;
	password: string;
	isPending?: boolean;
	error?: string | null;
}) {
	useStateMock
		.mockImplementationOnce(() => [values.name ?? "", vi.fn()])
		.mockImplementationOnce(() => [values.email, vi.fn()])
		.mockImplementationOnce(() => [values.password, vi.fn()])
		.mockImplementationOnce(() => [values.isPending ?? false, vi.fn()])
		.mockImplementationOnce(() => [values.error ?? null, vi.fn()]);
}

async function renderAuthCard(
	mode: "login" | "signup",
): Promise<SubmitElement> {
	const { default: AuthCard } = await import("#/components/AuthCard");

	return AuthCard({ mode }) as SubmitElement;
}

describe("AuthCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useStateMock.mockReset();
	});

	it("submits login credentials and navigates to todos", async () => {
		mockState({
			email: "user@example.com",
			password: "password-123",
		});

		signInEmail.mockResolvedValueOnce({ error: null });

		const element = await renderAuthCard("login");

		await element.props.onSubmit({
			preventDefault: vi.fn(),
		});

		expect(signInEmail).toHaveBeenCalledWith({
			email: "user@example.com",
			password: "password-123",
			callbackURL: "/todos",
		});
		expect(navigate).toHaveBeenCalledWith({ to: "/todos" });
	});

	it("stores auth errors returned by the client", async () => {
		const setError = vi.fn();

		useStateMock
			.mockImplementationOnce(() => ["", vi.fn()])
			.mockImplementationOnce(() => ["user@example.com", vi.fn()])
			.mockImplementationOnce(() => ["password-123", vi.fn()])
			.mockImplementationOnce(() => [false, vi.fn()])
			.mockImplementationOnce(() => [null, setError]);

		signInEmail.mockResolvedValueOnce({
			error: {
				message: "Invalid credentials.",
			},
		});

		const element = await renderAuthCard("login");

		await element.props.onSubmit({
			preventDefault: vi.fn(),
		});

		expect(setError).toHaveBeenCalledWith("Invalid credentials.");
	});

	it("submits signup credentials and navigates to todos", async () => {
		mockState({
			name: "Starter User",
			email: "new-user@example.com",
			password: "password-123",
		});

		signUpEmail.mockResolvedValueOnce({ error: null });

		const element = await renderAuthCard("signup");

		await element.props.onSubmit({
			preventDefault: vi.fn(),
		});

		expect(signUpEmail).toHaveBeenCalledWith({
			name: "Starter User",
			email: "new-user@example.com",
			password: "password-123",
			callbackURL: "/todos",
		});
		expect(navigate).toHaveBeenCalledWith({ to: "/todos" });
	});
});
