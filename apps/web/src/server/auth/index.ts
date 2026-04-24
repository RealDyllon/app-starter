import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { z } from "zod";

import { db } from "#/server/db";
import { account, session, user, verification } from "#/server/db/auth-schema";

const serverEnv = z
	.object({
		BETTER_AUTH_SECRET: z
			.string()
			.min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
		BETTER_AUTH_URL: z.string().url().optional(),
		SERVER_URL: z.string().url().optional(),
	})
	.superRefine(({ BETTER_AUTH_URL, SERVER_URL }, ctx) => {
		if (!BETTER_AUTH_URL && !SERVER_URL) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "BETTER_AUTH_URL or SERVER_URL is required",
				path: ["BETTER_AUTH_URL"],
			});
		}
	})
	.parse(process.env);

const authBaseUrl = serverEnv.BETTER_AUTH_URL ?? serverEnv.SERVER_URL;

if (!authBaseUrl) {
	throw new Error("BETTER_AUTH_URL or SERVER_URL is required");
}

const trustedOrigins = [
	...new Set(
		[serverEnv.BETTER_AUTH_URL, serverEnv.SERVER_URL].filter(
			(value): value is string => Boolean(value),
		),
	),
];

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			account,
			session,
			user,
			verification,
		},
	}),
	baseURL: authBaseUrl,
	secret: serverEnv.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins,
	plugins: [tanstackStartCookies()],
});
