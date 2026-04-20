import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry",
	},
	webServer: {
		command: "pnpm exec vite dev --host 127.0.0.1 --port 4173 --strictPort",
		reuseExistingServer: !process.env.CI,
		url: "http://127.0.0.1:4173",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
