import { router } from "@/server/trpc";
import { userCredentialsRouter } from "@/server/trpc/router/user/credentials";

export const userRouter = router({
  credentials: userCredentialsRouter,
});
