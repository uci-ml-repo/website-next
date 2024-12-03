import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import datasetsRouter from "@/server/trpc/routers/datasets";

import { procedure, router } from "../index";

export const appRouter = router({
  datasets: datasetsRouter,
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.ctx.session?.user?.name} ${JSON.stringify(opts.ctx.session?.user.permissions)} `,
      };
    }),
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
