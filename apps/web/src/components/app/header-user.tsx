import { Link } from "@tanstack/react-router";
import { m } from "#/i18n/messages";
import { authClient } from "#/lib/auth-client";

export default function BetterAuthHeader() {
	const { data: session, isPending } = authClient.useSession();

	async function handleSignOut() {
		await authClient.signOut();
		window.location.assign("/login");
	}

	if (isPending) {
		return (
			<div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
		);
	}

	if (session?.user) {
		return (
			<div className="flex items-center gap-2">
				{session.user.image ? (
					<img src={session.user.image} alt="" className="h-8 w-8" />
				) : (
					<div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
						<span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
							{session.user.name?.charAt(0).toUpperCase() ||
								m.auth_user_fallback_initial()}
						</span>
					</div>
				)}
				<button
					type="button"
					onClick={() => {
						void handleSignOut();
					}}
					className="flex-1 h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
				>
					{m.auth_sign_out()}
				</button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Link to="/login" className="nav-link">
				{m.auth_log_in()}
			</Link>
			<Link to="/signup" className="inline-cta m-0">
				{m.auth_sign_up()}
			</Link>
		</div>
	);
}
