import { router } from "@server/trpc";
import { userRouter } from "@server/trpc/router/user";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
