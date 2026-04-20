import { expect, test } from "@playwright/test";

test("renders the home page", async ({ page }) => {
	await page.goto("/");

	await expect(
		page.getByRole("heading", { name: /build from a stronger baseline/i }),
	).toBeVisible();
	await expect(
		page.getByRole("navigation", { name: /primary/i }),
	).toBeVisible();
});

test("navigates from home to about", async ({ page }) => {
	await page.goto("/");
	await page
		.getByRole("link", { name: /learn more about this starter/i })
		.click();

	await expect(
		page.getByRole("heading", {
			name: /what this project gives you out of the box/i,
		}),
	).toBeVisible();
});

test("renders the about page directly", async ({ page }) => {
	await page.goto("/about");

	await expect(
		page.getByRole("heading", {
			name: /what this project gives you out of the box/i,
		}),
	).toBeVisible();
	await expect(
		page.getByText(/tanstack start with file-based routing and ssr support/i),
	).toBeVisible();
});

test("returns to home with browser back navigation", async ({ page }) => {
	await page.goto("/");
	await page
		.getByRole("link", { name: /learn more about this starter/i })
		.click();
	await expect(page).toHaveURL(/\/about$/);

	await page.goBack();

	await expect(page).toHaveURL(/\/$/);
	await expect(
		page.getByRole("heading", { name: /build from a stronger baseline/i }),
	).toBeVisible();
});
