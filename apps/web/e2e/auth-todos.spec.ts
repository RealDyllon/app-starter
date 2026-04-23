import { expect, test } from "@playwright/test";

test("users can sign up and persist todos against the production server", async ({
	page,
}) => {
	const email = `playwright-${Date.now()}@example.com`;
	const todoName = `Persisted todo ${Date.now()}`;

	await page.goto("/signup");

	await page.getByLabel("Name").fill("Playwright User");
	await page.getByLabel("Email").fill(email);
	await page.getByLabel("Password").fill("playwright-password-123");
	await page.getByRole("button", { name: "Create account" }).click();

	await expect(page).toHaveURL(/\/todos$/);
	await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();

	await page.getByLabel("New todo").fill(todoName);
	await page.getByRole("button", { name: "Add todo" }).click();

	await expect(page.getByText(todoName, { exact: true })).toBeVisible();

	await page.reload();

	await expect(page.getByText(todoName, { exact: true })).toBeVisible();
});
