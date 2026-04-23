import { expect, test } from "@playwright/test";

function createUser(prefix: string) {
	const nonce = `${prefix}-${Date.now()}-${Math.round(Math.random() * 10_000)}`;

	return {
		name: `Starter ${prefix}`,
		email: `${nonce}@example.com`,
		password: `Pass-${nonce}-1234`,
	};
}

async function signUp(
	page: import("@playwright/test").Page,
	user: ReturnType<typeof createUser>,
) {
	await page.goto("/signup");
	await expect(
		page.getByRole("button", { name: "Open TanStack Devtools" }),
	).toBeVisible();

	const nameInput = page.locator('input[autocomplete="name"]');
	const emailInput = page.locator('input[autocomplete="email"]');
	const passwordInput = page.locator('input[autocomplete="new-password"]');

	await nameInput.fill(user.name);
	await emailInput.fill(user.email);
	await passwordInput.fill(user.password);

	await expect(nameInput).toHaveValue(user.name);
	await expect(emailInput).toHaveValue(user.email);
	await expect(passwordInput).toHaveValue(user.password);

	await page.getByRole("button", { name: "Create account" }).click();
	await expect(page).toHaveURL(/\/todos$/);
}

async function signIn(
	page: import("@playwright/test").Page,
	user: ReturnType<typeof createUser>,
) {
	await page.goto("/login");
	await expect(
		page.getByRole("button", { name: "Open TanStack Devtools" }),
	).toBeVisible();

	const emailInput = page.locator('input[autocomplete="email"]');
	const passwordInput = page.locator('input[autocomplete="current-password"]');

	await emailInput.fill(user.email);
	await passwordInput.fill(user.password);

	await expect(emailInput).toHaveValue(user.email);
	await expect(passwordInput).toHaveValue(user.password);

	await page.getByRole("button", { name: "Sign in" }).click();
	await expect(page).toHaveURL(/\/todos$/);
}

async function signOut(page: import("@playwright/test").Page) {
	await page.getByRole("button", { name: "Sign out" }).click();
	await expect(page).toHaveURL(/\/login$/);
}

test("protected todos require auth and remain user scoped", async ({
	page,
}) => {
	const firstUser = createUser("alpha");
	const secondUser = createUser("beta");
	const firstTodoTitle = `Private todo ${Date.now()}`;
	const secondTodoTitle = `Second todo ${Date.now()}`;
	const firstTodoNotes = "Only the first account should see this.";

	await page.goto("/todos");
	await expect(page).toHaveURL(/\/login$/);

	await signUp(page, firstUser);

	await page.getByLabel("New todo").fill(firstTodoTitle);
	await page.getByLabel("Notes").first().fill(firstTodoNotes);
	await page.getByRole("button", { name: "Add todo" }).click();

	await expect(page.getByText(firstTodoTitle, { exact: true })).toBeVisible();
	await expect(page.locator("article textarea").first()).toHaveValue(
		firstTodoNotes,
	);

	await signOut(page);
	await signUp(page, secondUser);

	await expect(page.getByText(firstTodoTitle, { exact: true })).toHaveCount(0);

	await page.getByLabel("New todo").fill(secondTodoTitle);
	await page.getByRole("button", { name: "Add todo" }).click();
	await expect(page.getByText(secondTodoTitle, { exact: true })).toBeVisible();

	await signOut(page);
	await signIn(page, firstUser);

	await expect(page.getByText(firstTodoTitle, { exact: true })).toBeVisible();
	await expect(page.getByText(secondTodoTitle, { exact: true })).toHaveCount(0);
});
