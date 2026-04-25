import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const DEFAULT_APP_TITLE = "app-starter";

const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_APP_TITLE: z.string().optional(),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});

export const appConfig = {
	title: env.VITE_APP_TITLE?.trim() || DEFAULT_APP_TITLE,
} as const;
