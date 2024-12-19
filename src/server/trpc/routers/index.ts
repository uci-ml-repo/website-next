import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import datasetsRouter from "@/server/trpc/routers/datasets";

import { router } from "../index";

export const appRouter = router({
  datasets: datasetsRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
