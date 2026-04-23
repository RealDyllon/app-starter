import { defineConfig, devices } from "@playwright/test";

const host = process.env.PLAYWRIGHT_WEB_HOST ?? "127.0.0.1";
const port = Number(process.env.PLAYWRIGHT_WEB_PORT ?? 4173);
const baseURL = `http://${host}:${port}`;
const serverMode = process.env.PLAYWRIGHT_SERVER_MODE ?? "dev";
const isBuildServer = serverMode === "build";
const webServerCommand = isBuildServer
	? "pnpm start"
	: `pnpm exec vite dev --host ${host} --port ${port}`;

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
		command: isBuildServer
			? webServerCommand
			: `pnpm db:migrate && pnpm db:prepare:e2e && pnpm exec vite dev --host ${host} --port ${port}`,
		env: {
			...process.env,
			BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? baseURL,
			BETTER_AUTH_SECRET:
				process.env.BETTER_AUTH_SECRET ??
				"playwright-test-secret-with-adequate-length",
			DATABASE_URL:
				process.env.DATABASE_URL ??
				"postgresql://postgres:postgres@127.0.0.1:5432/app_starter",
			HOST: process.env.HOST ?? host,
			PORT: process.env.PORT ?? String(port),
			SERVER_URL: process.env.SERVER_URL ?? baseURL,
			VITE_APP_TITLE: process.env.VITE_APP_TITLE ?? "app-starter",
		},
		url: baseURL,
		reuseExistingServer: serverMode === "dev" && !process.env.CI,
		timeout: 120 * 1000,
	},
});
