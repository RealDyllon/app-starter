import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "#/test/render-route";

describe("home route", () => {
	it("renders the starter homepage content", async () => {
		await renderRoute("/");

		expect(
			await screen.findByRole("heading", {
				name: /build from a stronger baseline/i,
			}),
		).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: /primary/i })).toBeVisible();
		expect(
			screen.getByRole("link", { name: /learn more about this starter/i }),
		).toHaveAttribute("href", "/about");
	});
});
