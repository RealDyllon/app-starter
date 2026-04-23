import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { configDefaults, defineConfig } from "vitest/config";

const config = defineConfig(({ mode }) => {
	const isTest = mode === "test";

	return {
		resolve: { tsconfigPaths: true },
		test: {
			exclude: [...configDefaults.exclude, "e2e/**"],
			environment: "jsdom",
			setupFiles: ["./src/test/setup.ts"],
			include: ["src/**/*.{test,spec}.{ts,tsx}"],
			coverage: {
				provider: "v8",
				reporter: ["text", "html", "lcov"],
				reportsDirectory: "./coverage",
				include: ["src/**/*.{ts,tsx}"],
				exclude: [
					"src/**/*.d.ts",
					"src/**/*.stories.{ts,tsx}",
					"src/routeTree.gen.ts",
					"src/storybook/**",
					"src/test/**",
				],
			},
		},
		plugins: isTest
			? [viteReact()]
			: [
					devtools(),
					paraglideVitePlugin({
						project: "./src/i18n/project.inlang",
						outdir: "./src/i18n/paraglide",
						strategy: ["url", "baseLocale"],
					}),
					nitro({ rollupConfig: { external: [/^@sentry\//] } }),
					tailwindcss(),
					tanstackStart(),
					viteReact(),
				],
	};
});
export default config;
