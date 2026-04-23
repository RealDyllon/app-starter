import { expect, test } from "@playwright/test";

test("home route renders the starter content", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle("app-starter");
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ship from a starter that actually exercises the stack.",
		}),
	).toBeVisible();
	await expect(
		page.getByText("Starter Baseline", { exact: true }),
	).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Open the todo slice" }),
	).toBeVisible();
});

test("users can navigate between home and about routes", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("link", { name: "About" }).click();
	await expect(page).toHaveURL(/\/about$/);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "What this starter now covers end to end.",
		}),
	).toBeVisible();

	await page.getByRole("link", { name: "Back to home" }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ship from a starter that actually exercises the stack.",
		}),
	).toBeVisible();
});
