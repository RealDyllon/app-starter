import { z } from "zod";

const optionalUrlEnv = z.preprocess(
	(value) => (value === "" ? undefined : value),
	z.string().url().optional(),
);

const serverAuthEnvSchema = z
	.object({
		BETTER_AUTH_SECRET: z
			.string()
			.min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
		BETTER_AUTH_URL: optionalUrlEnv,
		SERVER_URL: optionalUrlEnv,
	})
	.superRefine(({ BETTER_AUTH_URL, SERVER_URL }, ctx) => {
		if (!BETTER_AUTH_URL && !SERVER_URL) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "BETTER_AUTH_URL or SERVER_URL is required",
				path: ["BETTER_AUTH_URL"],
			});
		}
	});

export function parseServerAuthEnv(env: NodeJS.ProcessEnv) {
	return serverAuthEnvSchema.parse(env);
}
