import { execFileSync } from "node:child_process";
import process from "node:process";

import { Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is required for E2E database setup.");
}

const parsedDatabaseUrl = new URL(databaseUrl);
const localHosts = new Set(["127.0.0.1", "localhost"]);
const isLocalDatabase =
	localHosts.has(parsedDatabaseUrl.hostname) ||
	parsedDatabaseUrl.hostname.startsWith("192.168.") ||
	parsedDatabaseUrl.hostname === "::1";

if (!isLocalDatabase && process.env.PLAYWRIGHT_FORCE_DB_RESET !== "true") {
	throw new Error(
		[
			"Refusing to reset a non-local DATABASE_URL during Playwright setup.",
			`Received host: ${parsedDatabaseUrl.hostname}`,
			"Set PLAYWRIGHT_FORCE_DB_RESET=true only when you intend to wipe that database.",
		].join(" "),
	);
}

async function resetPublicSchema() {
	const client = new Client({
		connectionString: databaseUrl,
	});

	try {
		await client.connect();
		await client.query(`
			DROP SCHEMA IF EXISTS public CASCADE;
			CREATE SCHEMA public;
			GRANT ALL ON SCHEMA public TO CURRENT_USER;
			GRANT ALL ON SCHEMA public TO public;
		`);
	} finally {
		await client.end();
	}
}

await resetPublicSchema();

execFileSync(
	"pnpm",
	["exec", "drizzle-kit", "push", "--config", "drizzle.config.ts", "--force"],
	{
		cwd: new URL("..", import.meta.url),
		stdio: "inherit",
		env: process.env,
	},
);
