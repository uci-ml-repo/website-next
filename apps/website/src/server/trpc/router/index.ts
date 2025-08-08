import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import { datasetRouter } from "@/server/trpc/router/dataset";
import { featureRouter } from "@/server/trpc/router/feature";
import { keywordRouter } from "@/server/trpc/router/keyword";
import { userRouter } from "@/server/trpc/router/user";

export const appRouter = router({
  dataset: datasetRouter,
  keyword: keywordRouter,
  feature: featureRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
