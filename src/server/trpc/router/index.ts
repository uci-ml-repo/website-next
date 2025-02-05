import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import bookmarkRouter from "@/server/trpc/router/bookmark";
import datasetRouter from "@/server/trpc/router/dataset";
import discussionRouter from "@/server/trpc/router/discussion";
import filesRouter from "@/server/trpc/router/file";
import userRouter from "@/server/trpc/router/user";

export const appRouter = router({
  dataset: datasetRouter,
  discussion: discussionRouter,
  file: filesRouter,
  bookmark: bookmarkRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
