import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import AuthCardView from "#/components/AuthCardView";
import { m } from "#/i18n/messages";
import { authClient } from "#/lib/auth-client";

type AuthMode = "login" | "signup";

type AuthCardProps = {
	mode: AuthMode;
	redirectTo?: string;
};

export function sanitizeRedirectTarget(value: unknown) {
	if (typeof value !== "string") {
		return undefined;
	}

	const trimmedValue = value.trim();

	if (
		!trimmedValue ||
		!trimmedValue.startsWith("/") ||
		trimmedValue.startsWith("//")
	) {
		return undefined;
	}

	try {
		const parsedUrl = new URL(trimmedValue, "https://app.local");
		const redirectTarget = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

		if (redirectTarget.startsWith("//")) {
			return undefined;
		}

		return redirectTarget;
	} catch {
		return undefined;
	}
}

export function sanitizeCurrentLocationRedirect(value: unknown) {
	if (typeof value !== "string") {
		return undefined;
	}

	try {
		const parsedUrl = new URL(value, "https://app.local");

		return sanitizeRedirectTarget(
			`${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
		);
	} catch {
		return undefined;
	}
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return m.auth_generic_error();
}

export default function AuthCard({ mode, redirectTo }: AuthCardProps) {
	const navigate = useNavigate();
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const redirectTarget = sanitizeRedirectTarget(redirectTo);
	const destination = redirectTarget ?? "/todos";

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		setError(null);

		try {
			const formData = new FormData(event.currentTarget);
			const name = String(formData.get("name") ?? "");
			const email = String(formData.get("email") ?? "");
			const password = String(formData.get("password") ?? "");

			const result =
				mode === "signup"
					? await authClient.signUp.email({
							name,
							email,
							password,
							callbackURL: destination,
						})
					: await authClient.signIn.email({
							email,
							password,
							callbackURL: destination,
						});

			if (result.error) {
				setError(result.error.message ?? m.auth_failed());
				return;
			}

			await navigate({ to: destination });
		} catch (caughtError) {
			setError(getErrorMessage(caughtError));
		} finally {
			setIsPending(false);
		}
	}

	return (
		<AuthCardView
			mode={mode}
			isPending={isPending}
			error={error}
			redirectTo={redirectTarget}
			onSubmit={handleSubmit}
		/>
	);
}
