import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import bookmarkRouter from "@/server/trpc/routers/bookmark";
import datasetRouter from "@/server/trpc/routers/dataset";
import discussionRouter from "@/server/trpc/routers/discussion";
import filesRouter from "@/server/trpc/routers/file";

export const appRouter = router({
  dataset: datasetRouter,
  discussion: discussionRouter,
  file: filesRouter,
  bookmark: bookmarkRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
