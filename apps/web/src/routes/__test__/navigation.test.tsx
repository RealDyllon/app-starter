import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderRoute } from "#/test/render-route";

describe("route navigation", () => {
	it("navigates between the home and about routes", async () => {
		const user = userEvent.setup();
		const { router } = await renderRoute("/");

		await user.click(
			await screen.findByRole("link", {
				name: /learn more about this starter/i,
			}),
		);

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/about");
		});

		expect(
			await screen.findByRole("heading", {
				name: /what this project gives you out of the box/i,
			}),
		).toBeInTheDocument();

		await user.click(
			screen.getByRole("link", {
				name: /back to home/i,
			}),
		);

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/");
		});

		expect(
			await screen.findByRole("heading", {
				name: /build from a stronger baseline/i,
			}),
		).toBeInTheDocument();
	});
});
