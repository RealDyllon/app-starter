import deCatalog from "./messages/de.json";
import enCatalog from "./messages/en.json";

import { getLocale } from "./runtime";

type MessageCatalog = typeof enCatalog;
type MessageKey = keyof MessageCatalog;
type MessageVariables = Record<string, number | string>;

const catalogs = {
	de: deCatalog,
	en: enCatalog,
} as const satisfies Record<string, MessageCatalog>;

function formatMessage(
	key: MessageKey,
	variables: MessageVariables = {},
): string {
	const locale = getLocale();
	const catalog = catalogs[locale] ?? enCatalog;
	const template = catalog[key] ?? enCatalog[key] ?? key;

	return template.replaceAll(/\{(\w+)\}/g, (match, variableName) => {
		return String(variables[variableName] ?? match);
	});
}

type MessageFunctions = {
	[K in MessageKey]: (variables?: MessageVariables) => string;
};

export const m = new Proxy({} as MessageFunctions, {
	get: (_target, property) => {
		if (typeof property !== "string" || !(property in enCatalog)) {
			return () => String(property);
		}

		return (variables?: MessageVariables) =>
			formatMessage(property as MessageKey, variables);
	},
});
