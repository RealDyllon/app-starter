import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import AuthCardView from "#/components/AuthCardView";
import { authClient } from "#/lib/auth-client";

type AuthMode = "login" | "signup";

type AuthCardProps = {
	mode: AuthMode;
};

function getErrorMessage(error: unknown) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Something went wrong. Please try again.";
}

export default function AuthCard({ mode }: AuthCardProps) {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		setError(null);

		try {
			const result =
				mode === "signup"
					? await authClient.signUp.email({
							name,
							email,
							password,
							callbackURL: "/todos",
						})
					: await authClient.signIn.email({
							email,
							password,
							callbackURL: "/todos",
						});

			if (result.error) {
				setError(result.error.message ?? "Authentication failed.");
				return;
			}

			await navigate({ to: "/todos" });
		} catch (caughtError) {
			setError(getErrorMessage(caughtError));
		} finally {
			setIsPending(false);
		}
	}

	return (
		<AuthCardView
			mode={mode}
			name={name}
			email={email}
			password={password}
			isPending={isPending}
			error={error}
			onNameChange={setName}
			onEmailChange={setEmail}
			onPasswordChange={setPassword}
			onSubmit={handleSubmit}
		/>
	);
}
