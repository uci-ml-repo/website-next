import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import { bookmarkRouter } from "@/server/trpc/router/bookmark";
import { datasetRouter } from "@/server/trpc/router/dataset";
import { discussionRouter } from "@/server/trpc/router/discussion";
import { fileRouter } from "@/server/trpc/router/file";
import { keywordRouter } from "@/server/trpc/router/keyword";
import { userRouter } from "@/server/trpc/router/user";
import { variableRouter } from "@/server/trpc/router/variable";

export const appRouter = router({
  variable: variableRouter,
  bookmark: bookmarkRouter,
  dataset: datasetRouter,
  discussion: discussionRouter,
  file: fileRouter,
  keyword: keywordRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
