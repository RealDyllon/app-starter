import { Link } from "@tanstack/react-router";

import { m } from "#/i18n/messages";

type AuthMode = "login" | "signup";

type AuthCardViewProps = {
	mode: AuthMode;
	isPending: boolean;
	error: string | null;
	redirectTo?: string;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const copyByMode = {
	login: {
		eyebrow: m.auth_login_eyebrow(),
		title: m.auth_login_title(),
		description: m.auth_login_description(),
		submitLabel: m.auth_login_submit(),
		alternateHref: "/signup",
		alternateLabel: m.auth_login_alternate(),
	},
	signup: {
		eyebrow: m.auth_signup_eyebrow(),
		title: m.auth_signup_title(),
		description: m.auth_signup_description(),
		submitLabel: m.auth_signup_submit(),
		alternateHref: "/login",
		alternateLabel: m.auth_signup_alternate(),
	},
} as const;

export default function AuthCardView({
	mode,
	isPending,
	error,
	redirectTo,
	onSubmit,
}: AuthCardViewProps) {
	const copy = copyByMode[mode];
	const alternateSearch = redirectTo ? { redirect: redirectTo } : undefined;

	return (
		<main className="app-shell">
			<section className="page-wrap">
				<section className="hello-card">
					<p className="hello-label">{copy.eyebrow}</p>
					<h1>{copy.title}</h1>
					<p>{copy.description}</p>

					<form className="stack-form" onSubmit={onSubmit}>
						{mode === "signup" ? (
							<label className="form-field">
								<span>{m.auth_name_label()}</span>
								<input
									name="name"
									placeholder={m.auth_name_placeholder()}
									autoComplete="name"
									required
								/>
							</label>
						) : null}

						<label className="form-field">
							<span>{m.auth_email_label()}</span>
							<input
								name="email"
								placeholder={m.auth_email_placeholder()}
								autoComplete="email"
								type="email"
								required
							/>
						</label>

						<label className="form-field">
							<span>{m.auth_password_label()}</span>
							<input
								name="password"
								placeholder={m.auth_password_placeholder()}
								autoComplete={
									mode === "signup" ? "new-password" : "current-password"
								}
								type="password"
								required
							/>
						</label>

						{error ? <p className="form-error">{error}</p> : null}

						<div className="form-actions">
							<button
								className="inline-cta m-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
								type="submit"
								disabled={isPending}
							>
								{isPending ? m.auth_working() : copy.submitLabel}
							</button>
							<Link
								to={copy.alternateHref}
								search={alternateSearch}
								className="nav-link"
							>
								{copy.alternateLabel}
							</Link>
						</div>
					</form>
				</section>
			</section>
		</main>
	);
}
