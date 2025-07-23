import { router } from "@website/server/trpc";
import { userRouter } from "@website/server/trpc/router/user";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
