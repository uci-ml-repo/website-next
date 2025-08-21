import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import { bookmarkRouter } from "@/server/trpc/router/bookmark";
import { datasetRouter } from "@/server/trpc/router/dataset";
import { featureRouter } from "@/server/trpc/router/feature";
import { fileRouter } from "@/server/trpc/router/file";
import { keywordRouter } from "@/server/trpc/router/keyword";
import { userRouter } from "@/server/trpc/router/user";

export const appRouter = router({
  dataset: datasetRouter,
  keyword: keywordRouter,
  feature: featureRouter,
  file: fileRouter,
  bookmark: bookmarkRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
