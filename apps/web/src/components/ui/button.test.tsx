import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
	it("renders with the default button metadata", () => {
		render(<Button>Save changes</Button>);

		const button = screen.getByRole("button", { name: "Save changes" });

		expect(button).toHaveAttribute("data-variant", "default");
		expect(button).toHaveAttribute("data-size", "default");
	});

	it("renders the child element when asChild is enabled", () => {
		render(
			<Button asChild variant="link">
				<a href="/docs">Open docs</a>
			</Button>,
		);

		const link = screen.getByRole("link", { name: "Open docs" });

		expect(link).toHaveAttribute("href", "/docs");
		expect(link).toHaveAttribute("data-variant", "link");
	});
});
