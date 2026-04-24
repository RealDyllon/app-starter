import { defineConfig, devices } from "@playwright/test";

const host = process.env.PLAYWRIGHT_WEB_HOST ?? "127.0.0.1";
const port = Number(process.env.PLAYWRIGHT_WEB_PORT ?? 4173);
const baseURL = `http://${host}:${port}`;
const serverMode = process.env.PLAYWRIGHT_SERVER_MODE ?? "build";
const isBuildServer = serverMode === "build";
const prepareDatabaseCommand = "pnpm exec tsx scripts/prepare-test-db.ts";
const appServerCommand = isBuildServer
	? "pnpm build && pnpm start"
	: `pnpm exec vite dev --host ${host} --port ${port}`;
const webServerCommand = `${prepareDatabaseCommand} && ${appServerCommand}`;
const reuseExistingServer =
	process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "true";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
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
		command: webServerCommand,
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
		reuseExistingServer,
		timeout: 120 * 1000,
	},
});
