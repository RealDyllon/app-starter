import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/server/db";
import { account, session, user, verification } from "#/server/db/auth-schema";

const betterAuthUrl = process.env.BETTER_AUTH_URL;
if (!betterAuthUrl) {
	throw new Error("BETTER_AUTH_URL is required");
}

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
if (!betterAuthSecret) {
	throw new Error("BETTER_AUTH_SECRET is required");
}

if (betterAuthSecret.length < 32) {
	throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

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
	baseURL: betterAuthUrl,
	secret: betterAuthSecret,
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: [betterAuthUrl],
	plugins: [tanstackStartCookies()],
});
