import { describe, expect, it } from "vitest";
import { parseServerAuthEnv } from "./env";

const secret = "test-secret-value-that-is-long-enough";

describe("parseServerAuthEnv", () => {
	it("treats empty optional URL env vars as unset", () => {
		expect(
			parseServerAuthEnv({
				BETTER_AUTH_SECRET: secret,
				BETTER_AUTH_URL: "",
				SERVER_URL: "http://localhost:3000",
			}),
		).toEqual({
			BETTER_AUTH_SECRET: secret,
			BETTER_AUTH_URL: undefined,
			SERVER_URL: "http://localhost:3000",
		});
	});

	it("keeps Better Auth URL when both URL env vars are present", () => {
		expect(
			parseServerAuthEnv({
				BETTER_AUTH_SECRET: secret,
				BETTER_AUTH_URL: "https://auth.example.com",
				SERVER_URL: "https://app.example.com",
			}),
		).toMatchObject({
			BETTER_AUTH_URL: "https://auth.example.com",
			SERVER_URL: "https://app.example.com",
		});
	});

	it("requires at least one auth base URL after empty strings are normalized", () => {
		expect(() =>
			parseServerAuthEnv({
				BETTER_AUTH_SECRET: secret,
				BETTER_AUTH_URL: "",
				SERVER_URL: "",
			}),
		).toThrow("BETTER_AUTH_URL or SERVER_URL is required");
	});
});
