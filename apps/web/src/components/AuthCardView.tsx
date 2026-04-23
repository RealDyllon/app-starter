import { Link } from "@tanstack/react-router";

type AuthMode = "login" | "signup";

type AuthCardViewProps = {
	mode: AuthMode;
	name: string;
	email: string;
	password: string;
	isPending: boolean;
	error: string | null;
	onNameChange: (value: string) => void;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const copyByMode = {
	login: {
		eyebrow: "Welcome back",
		title: "Sign in to keep working from the starter baseline.",
		description:
			"Use Better Auth with the colocated `/api/auth` route and the shared Postgres connection.",
		submitLabel: "Sign in",
		alternateHref: "/signup",
		alternateLabel: "Create an account",
	},
	signup: {
		eyebrow: "Create account",
		title: "Create a local account backed by Better Auth.",
		description:
			"This route gives the starter a working auth entrypoint instead of a disconnected session widget.",
		submitLabel: "Create account",
		alternateHref: "/login",
		alternateLabel: "Already have an account?",
	},
} as const;

export default function AuthCardView({
	mode,
	name,
	email,
	password,
	isPending,
	error,
	onNameChange,
	onEmailChange,
	onPasswordChange,
	onSubmit,
}: AuthCardViewProps) {
	const copy = copyByMode[mode];

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
								<span>Name</span>
								<input
									value={name}
									onChange={(event) => onNameChange(event.target.value)}
									placeholder="Starter User"
									autoComplete="name"
									required
								/>
							</label>
						) : null}

						<label className="form-field">
							<span>Email</span>
							<input
								value={email}
								onChange={(event) => onEmailChange(event.target.value)}
								placeholder="you@example.com"
								autoComplete="email"
								type="email"
								required
							/>
						</label>

						<label className="form-field">
							<span>Password</span>
							<input
								value={password}
								onChange={(event) => onPasswordChange(event.target.value)}
								placeholder="At least 8 characters"
								autoComplete={
									mode === "signup" ? "new-password" : "current-password"
								}
								type="password"
								required
							/>
						</label>

						{error ? <p className="form-error">{error}</p> : null}

						<div className="form-actions">
							<button className="inline-cta m-0 cursor-pointer" type="submit">
								{isPending ? "Working…" : copy.submitLabel}
							</button>
							<Link to={copy.alternateHref} className="nav-link">
								{copy.alternateLabel}
							</Link>
						</div>
					</form>
				</section>
			</section>
		</main>
	);
}
