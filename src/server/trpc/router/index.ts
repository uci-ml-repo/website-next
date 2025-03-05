import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "@/server/trpc";
import { bookmarkRouter } from "@/server/trpc/router/bookmark";
import { datasetRouter } from "@/server/trpc/router/dataset";
import { discussionRouter } from "@/server/trpc/router/discussion";
import { editRouter } from "@/server/trpc/router/edit";
import { fileRouter } from "@/server/trpc/router/file";
import { keywordRouter } from "@/server/trpc/router/keyword";
import { reportRouter } from "@/server/trpc/router/report";
import { userRouter } from "@/server/trpc/router/user";
import { variableRouter } from "@/server/trpc/router/variable";

export const appRouter = router({
  variable: variableRouter,
  bookmark: bookmarkRouter,
  dataset: datasetRouter,
  discussion: discussionRouter,
  edit: editRouter,
  file: fileRouter,
  keyword: keywordRouter,
  report: reportRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
