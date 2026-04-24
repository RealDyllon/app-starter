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
			event: Pick<
				FormEvent<HTMLFormElement>,
				"currentTarget" | "preventDefault"
			>,
		) => Promise<void>;
	};
};

function mockState(values: { isPending?: boolean; error?: string | null }) {
	useStateMock
		.mockImplementationOnce(() => [values.isPending ?? false, vi.fn()])
		.mockImplementationOnce(() => [values.error ?? null, vi.fn()]);
}

function submitEvent(values: {
	name?: string;
	email: string;
	password: string;
}) {
	const form = document.createElement("form");

	for (const [name, value] of Object.entries(values)) {
		if (value === undefined) {
			continue;
		}

		const input = document.createElement("input");
		input.name = name;
		input.value = value;
		form.append(input);
	}

	return {
		currentTarget: form,
		preventDefault: vi.fn(),
	};
}

async function renderAuthCard(
	mode: "login" | "signup",
	redirectTo?: string,
): Promise<SubmitElement> {
	const { default: AuthCard } = await import("#/components/AuthCard");

	return AuthCard({ mode, redirectTo }) as SubmitElement;
}

describe("AuthCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useStateMock.mockReset();
	});

	it("submits login credentials and navigates to the validated redirect target", async () => {
		mockState({});

		signInEmail.mockResolvedValueOnce({ error: null });

		const element = await renderAuthCard("login", "/todos?filter=done");

		await element.props.onSubmit(
			submitEvent({
				email: "user@example.com",
				password: "password-123",
			}),
		);

		expect(signInEmail).toHaveBeenCalledWith({
			email: "user@example.com",
			password: "password-123",
			callbackURL: "/todos?filter=done",
		});
		expect(navigate).toHaveBeenCalledWith({ to: "/todos?filter=done" });
	});

	it("stores auth errors returned by the client", async () => {
		const setError = vi.fn();

		useStateMock
			.mockImplementationOnce(() => [false, vi.fn()])
			.mockImplementationOnce(() => [null, setError]);

		signInEmail.mockResolvedValueOnce({
			error: {
				message: "Invalid credentials.",
			},
		});

		const element = await renderAuthCard("login");

		await element.props.onSubmit(
			submitEvent({
				email: "user@example.com",
				password: "password-123",
			}),
		);

		expect(setError).toHaveBeenCalledWith("Invalid credentials.");
	});

	it("submits signup credentials and navigates to todos by default", async () => {
		mockState({});

		signUpEmail.mockResolvedValueOnce({ error: null });

		const element = await renderAuthCard("signup");

		await element.props.onSubmit(
			submitEvent({
				name: "Starter User",
				email: "new-user@example.com",
				password: "password-123",
			}),
		);

		expect(signUpEmail).toHaveBeenCalledWith({
			name: "Starter User",
			email: "new-user@example.com",
			password: "password-123",
			callbackURL: "/todos",
		});
		expect(navigate).toHaveBeenCalledWith({ to: "/todos" });
	});

	it("ignores non-local redirect targets", async () => {
		mockState({});

		signInEmail.mockResolvedValueOnce({ error: null });

		const element = await renderAuthCard("login", "https://example.com/todos");

		await element.props.onSubmit(
			submitEvent({
				email: "user@example.com",
				password: "password-123",
			}),
		);

		expect(signInEmail).toHaveBeenCalledWith({
			email: "user@example.com",
			password: "password-123",
			callbackURL: "/todos",
		});
		expect(navigate).toHaveBeenCalledWith({ to: "/todos" });
	});
});
