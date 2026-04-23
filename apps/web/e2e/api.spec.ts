import { expect, test } from "@playwright/test";

test("GET /api serves the API reference document", async ({ request }) => {
	const response = await request.get("/api");

	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("text/html");

	const body = await response.text();
	expect(body).toContain("<title>API Reference</title>");
	expect(body).toContain("TanStack ORPC Playground");
});

test("POST /api/rpc/listTodos rejects unauthenticated requests", async ({
	request,
}) => {
	const response = await request.post("/api/rpc/listTodos", {
		data: {},
	});

	expect(response.status()).toBe(401);

	const body = await response.json();
	expect(body).toMatchObject({
		json: {
			code: "UNAUTHORIZED",
			status: 401,
			message: "You must sign in to continue.",
		},
	});
});
