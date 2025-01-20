import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import bookmarksRouter from "@/server/trpc/routers/bookmarks";
import datasetsRouter from "@/server/trpc/routers/datasets";
import discussionsRouter from "@/server/trpc/routers/discussions";
import filesRouter from "@/server/trpc/routers/files";

export const appRouter = router({
  datasets: datasetsRouter,
  discussions: discussionsRouter,
  files: filesRouter,
  bookmarks: bookmarksRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
