import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { parseServerAuthEnv } from "#/server/auth/env";
import { db } from "#/server/db";
import { account, session, user, verification } from "#/server/db/auth-schema";

const serverEnv = parseServerAuthEnv(process.env);

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
