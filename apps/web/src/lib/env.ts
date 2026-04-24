const DEFAULT_APP_TITLE = "app-starter";

export const appConfig = {
	title: import.meta.env.VITE_APP_TITLE?.trim() || DEFAULT_APP_TITLE,
} as const;
