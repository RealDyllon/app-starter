import { QueryClient } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRouteWithContext,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { act, render } from "@testing-library/react";
import { Route as AboutRouteImport } from "#/routes/about";
import { Route as IndexRouteImport } from "#/routes/index";

type TestRouterContext = {
	queryClient: QueryClient;
};

const testRootRoute = createRootRouteWithContext<TestRouterContext>()({
	component: Outlet,
});

const indexRoute = IndexRouteImport.update({
	id: "/",
	path: "/",
	getParentRoute: () => testRootRoute,
} as never);

const aboutRoute = AboutRouteImport.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => testRootRoute,
} as never);

const testRouteTree = testRootRoute.addChildren([indexRoute, aboutRoute]);

export async function renderRoute(pathname: string) {
	const queryClient = new QueryClient();
	const history = createMemoryHistory({
		initialEntries: [pathname],
	});

	const router = createRouter({
		routeTree: testRouteTree,
		history,
		context: {
			queryClient,
		},
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	setupRouterSsrQueryIntegration({ router, queryClient });

	const result = render(<RouterProvider router={router} />);

	await act(async () => {
		await router.load();
	});

	return {
		router,
		queryClient,
		...result,
	};
}
