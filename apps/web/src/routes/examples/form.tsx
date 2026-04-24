import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/examples/form")({
	component: FormExample,
});

type LeadForm = {
	name: string;
	email: string;
	projectType: string;
};

function FormExample() {
	const [submittedLead, setSubmittedLead] = useState<LeadForm | null>(null);
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			projectType: "Internal tool",
		} satisfies LeadForm,
		onSubmit: ({ value }) => {
			setSubmittedLead(value);
		},
	});

	return (
		<main className="app-shell">
			<section className="page-wrap">
				<nav aria-label="Examples" className="page-nav">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/examples/form" className="nav-link">
						Form
					</Link>
					<Link to="/examples/table" className="nav-link">
						Table
					</Link>
					<Link to="/examples/store" className="nav-link">
						Store
					</Link>
				</nav>

				<section className="hello-card">
					<p className="hello-label">TanStack Form</p>
					<h1>Validated project intake</h1>
					<p>
						A compact form example with field-level validation, typed values,
						and a submit handler that can be replaced with a server action or
						oRPC mutation.
					</p>

					<form
						className="stack-form"
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							void form.handleSubmit();
						}}
					>
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) =>
									value.trim().length < 2
										? "Name must be at least 2 characters."
										: undefined,
							}}
						>
							{(field) => (
								<label className="form-field">
									<span>Name</span>
									<input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										placeholder="Ada Lovelace"
									/>
									{field.state.meta.errors.length > 0 ? (
										<small className="form-error">
											{field.state.meta.errors.join(" ")}
										</small>
									) : null}
								</label>
							)}
						</form.Field>

						<form.Field
							name="email"
							validators={{
								onChange: ({ value }) =>
									/^\S+@\S+\.\S+$/.test(value)
										? undefined
										: "Use a valid email address.",
							}}
						>
							{(field) => (
								<label className="form-field">
									<span>Email</span>
									<input
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
										placeholder="ada@example.com"
									/>
									{field.state.meta.errors.length > 0 ? (
										<small className="form-error">
											{field.state.meta.errors.join(" ")}
										</small>
									) : null}
								</label>
							)}
						</form.Field>

						<form.Field name="projectType">
							{(field) => (
								<label className="form-field">
									<span>Project type</span>
									<select
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => field.handleChange(event.target.value)}
									>
										<option>Internal tool</option>
										<option>Customer app</option>
										<option>Data workflow</option>
									</select>
								</label>
							)}
						</form.Field>

						<div className="form-actions">
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
							>
								{([canSubmit, isSubmitting]) => (
									<button
										type="submit"
										className="inline-cta"
										disabled={!canSubmit}
									>
										{isSubmitting ? "Saving..." : "Save lead"}
									</button>
								)}
							</form.Subscribe>
							<button
								type="button"
								className="nav-link"
								onClick={() => form.reset()}
							>
								Reset
							</button>
						</div>
					</form>

					{submittedLead ? (
						<pre className="example-output">
							{JSON.stringify(submittedLead, null, 2)}
						</pre>
					) : null}
				</section>
			</section>
		</main>
	);
}
