import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRoute } from "#/test/render-route";

describe("about route", () => {
	it("renders the about page content", async () => {
		await renderRoute("/about");

		expect(
			await screen.findByRole("heading", {
				name: /what this project gives you out of the box/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/tanstack start with file-based routing and ssr support/i,
			),
		).toBeVisible();
		expect(
			screen.getByRole("link", {
				name: /back to home/i,
			}),
		).toHaveAttribute("href", "/");
	});
});
