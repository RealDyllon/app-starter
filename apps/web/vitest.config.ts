import path from "node:path";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^#\/(.*)$/,
				replacement: `${path.resolve(__dirname, "./src")}/$1`,
			},
			{
				find: /^@\/(.*)$/,
				replacement: `${path.resolve(__dirname, "./src")}/$1`,
			},
		],
	},
	plugins: [viteReact()],
	test: {
		dir: "./src",
		environment: "jsdom",
		include: ["**/*.{test,spec}.{ts,tsx}"],
		setupFiles: ["./src/test/setup.ts"],
		clearMocks: true,
		restoreMocks: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.d.ts",
				"src/routeTree.gen.ts",
				"src/paraglide/**",
				"src/components/storybook/**",
				"src/components/LocaleSwitcher.tsx",
				"src/routes/api/**",
				"src/routes/__root.tsx",
				"src/test/**",
				"src/routes/__test__/**",
				"src/**/*.{test,spec}.{ts,tsx}",
			],
		},
	},
});
