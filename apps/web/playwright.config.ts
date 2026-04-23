import { defineConfig, devices } from "@playwright/test";

const host = process.env.PLAYWRIGHT_WEB_HOST ?? "127.0.0.1";
const port = Number(process.env.PLAYWRIGHT_WEB_PORT ?? 4173);
const baseURL = `http://${host}:${port}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: `pnpm exec vite dev --host ${host} --port ${port}`,
		env: {
			...process.env,
			BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? baseURL,
			BETTER_AUTH_SECRET:
				process.env.BETTER_AUTH_SECRET ?? "playwright-test-secret",
			DATABASE_URL:
				process.env.DATABASE_URL ??
				"postgresql://postgres:postgres@127.0.0.1:5432/app_starter",
			SERVER_URL: process.env.SERVER_URL ?? baseURL,
			VITE_APP_TITLE: process.env.VITE_APP_TITLE ?? "app-starter",
		},
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
