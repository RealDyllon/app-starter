import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.mock("@tanstack/react-devtools", () => ({
	TanStackDevtools: () => null,
}));

vi.mock("@tanstack/react-query-devtools", () => ({
	ReactQueryDevtoolsPanel: () => null,
}));

vi.mock("@tanstack/react-router-devtools", () => ({
	TanStackRouterDevtoolsPanel: () => null,
}));

window.scrollTo = vi.fn();

afterEach(() => {
	cleanup();
	document.head.innerHTML = "";
	document.documentElement.className = "";
	document.documentElement.removeAttribute("lang");
});
