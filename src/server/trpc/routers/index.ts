import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import datasetsRouter from "@/server/trpc/routers/datasets";
import discussionsRouter from "@/server/trpc/routers/discussions";
import draftDatasetsRouter from "@/server/trpc/routers/drafts";
import filesRouter from "@/server/trpc/routers/files";

import { router } from "../index";

export const appRouter = router({
  datasets: datasetsRouter,
  drafts: draftDatasetsRouter,
  discussions: discussionsRouter,
  files: filesRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
