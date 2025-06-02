import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "@/components/Header";
import { ApplicationsPage } from "@/pages/ApplicationsPage";
import { ApplicationPage } from "@/pages/ApplicationPage";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ApplicationsPage,
});

export const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/applications",
  component: ApplicationsPage,
});

export const applicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/applications/$appId",
  component: ApplicationPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  applicationsRoute.addChildren([applicationRoute]),
]);
