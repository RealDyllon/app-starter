import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/server/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	baseURL: process.env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: process.env.BETTER_AUTH_URL
		? [process.env.BETTER_AUTH_URL]
		: undefined,
	plugins: [tanstackStartCookies()],
});
