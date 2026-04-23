import { createFileRoute } from "@tanstack/react-router";

import AuthCard from "#/components/AuthCard";

export const Route = createFileRoute("/signup")({
	component: SignupPage,
});

function SignupPage() {
	return <AuthCard mode="signup" />;
}
