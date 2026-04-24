import { ORPCError, os } from "@orpc/server";

import type { AuthSession } from "#/server/auth/session";
import { getSessionFromHeaders } from "#/server/auth/session";

type ORPCContext = {
	headers: Headers;
};

export const base = os.$context<ORPCContext>();

export const protectedProcedure = base.use(async ({ context, next }) => {
	const session = await getSessionFromHeaders(context.headers);

	if (!session) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "You must sign in to continue.",
		});
	}

	return next({
		context: {
			session,
		},
	});
});

export type ProtectedProcedureContext = {
	session: AuthSession;
};
