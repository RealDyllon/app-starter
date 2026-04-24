import { expect, test } from "@playwright/test";

function uniqueValue(prefix: string) {
	return `${prefix}-${crypto.randomUUID()}`;
}

test("users can sign up and persist todos against the production server", async ({
	page,
}) => {
	const email = `${uniqueValue("playwright")}@example.com`;
	const todoName = `Persisted todo ${uniqueValue("todo")}`;

	await page.goto("/signup");

	await page.locator('input[autocomplete="name"]').fill("Playwright User");
	await page.locator('input[autocomplete="email"]').fill(email);
	await page
		.locator('input[autocomplete="new-password"]')
		.fill("playwright-password-123");
	await page.getByRole("button", { name: "Create account" }).click();

	await expect(page).toHaveURL(/\/todos$/);
	await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();

	await page.getByLabel("New todo").fill(todoName);
	await page.getByRole("button", { name: "Add todo" }).click();

	await expect(page.getByText(todoName, { exact: true })).toBeVisible();

	await page.reload();

	await expect(page.getByText(todoName, { exact: true })).toBeVisible();
});
