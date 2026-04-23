import { auth } from "#/server/auth";

export type AuthSession = NonNullable<
	Awaited<ReturnType<typeof auth.api.getSession>>
>;

export async function getSessionFromHeaders(headers: Headers) {
	return auth.api.getSession({
		headers,
	});
}
