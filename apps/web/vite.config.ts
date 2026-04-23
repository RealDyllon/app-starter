import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { configDefaults, defineConfig } from "vitest/config";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		exclude: [...configDefaults.exclude, "e2e/**"],
	},
	plugins: [
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
});

export default config;
