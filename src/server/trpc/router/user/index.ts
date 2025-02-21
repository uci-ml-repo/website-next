import { router } from "@/server/trpc";
import { userCredentialsRouter } from "@/server/trpc/router/user/credentials";
import { userFindRouter } from "@/server/trpc/router/user/find";

export const userRouter = router({
  credentials: userCredentialsRouter,
  find: userFindRouter,
});
