import { createFileRoute } from "@tanstack/react-router";
import AuthCard, { sanitizeRedirectTarget } from "#/components/AuthCard";

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>) => {
		const redirect = sanitizeRedirectTarget(search.redirect);

		return redirect ? { redirect } : {};
	},
	component: LoginPage,
});

function LoginPage() {
	const { redirect } = Route.useSearch();

	return <AuthCard mode="login" redirectTo={redirect} />;
}
