import { createFileRoute } from "@tanstack/react-router";

import AuthCard from "#/components/AuthCard";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return <AuthCard mode="login" />;
}
