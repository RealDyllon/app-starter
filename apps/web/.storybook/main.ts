import type { StorybookConfig } from "@storybook/react-vite";
import type { PluginOption } from "vite";

const tanstackStartPluginNames = new Set([
	"tanstack-react-start:config",
	"tanstack-start-core:config",
	"tanstack-start-core:virtual-client-entry",
	"tanstack-start-core:post-build",
	"tanstack-start-core:dev-base-rewrite",
	"tanstack-start-core:load-env",
	"tanstack-start-core:preview-server",
	"tanstack-start-core:capture-server-fn-module-lookup",
	"tanstack-start-core:validate-server-fn-id",
	"tanstack-start-core:server-fn-resolver",
	"tanstack-start-core:dev-server",
	"tanstack-start-core:dev-server:injected-head-scripts",
	"tanstack-start-core:import-protection",
	"tanstack-start-core:import-protection-transform-cache",
	"tanstack-start:route-tree-client-plugin",
	"tanstack-start:plugin-adapters",
	"tanstack-start:start-manifest-capture-client-build",
	"tanstack-start:start-manifest-plugin",
]);

function withoutTanstackStartPlugins(plugins: PluginOption[]): PluginOption[] {
	return plugins.flatMap((plugin) => {
		if (!plugin) {
			return [];
		}

		if (Array.isArray(plugin)) {
			return withoutTanstackStartPlugins(plugin);
		}

		if (
			typeof plugin === "object" &&
			"name" in plugin &&
			typeof plugin.name === "string" &&
			tanstackStartPluginNames.has(plugin.name)
		) {
			return [];
		}

		return [plugin];
	});
}

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [],
	framework: {
		name: "@storybook/react-vite",
		options: {
			builder: {
				viteConfigPath: ".storybook/main.ts",
			},
		},
	},
	async viteFinal(config) {
		const { default: tailwindcss } = await import("@tailwindcss/vite");
		config.plugins = [
			...withoutTanstackStartPlugins(config.plugins || []),
			tailwindcss(),
		];
		return config;
	},
};
export default config;
