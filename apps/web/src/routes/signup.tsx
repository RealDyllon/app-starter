import { createFileRoute } from "@tanstack/react-router";
import AuthCard, { sanitizeRedirectTarget } from "#/components/AuthCard";

export const Route = createFileRoute("/signup")({
	validateSearch: (search: Record<string, unknown>) => {
		const redirect = sanitizeRedirectTarget(search.redirect);

		return redirect ? { redirect } : {};
	},
	component: SignupPage,
});

function SignupPage() {
	const { redirect } = Route.useSearch();

	return <AuthCard mode="signup" redirectTo={redirect} />;
}
