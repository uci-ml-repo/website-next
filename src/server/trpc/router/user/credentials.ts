import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const userCredentialsRouter = router({
  sendResetPasswordEmail: procedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      return service.user.credentials.sendResetPasswordEmail({
        email: input.email,
      });
    }),

  getResetPasswordToken: procedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      return service.user.credentials.getResetPasswordToken(input.token);
    }),

  resetPassword: procedure
    .input(z.object({ password: z.string(), token: z.string() }))
    .mutation(async ({ input }) => {
      return service.user.credentials.resetPassword(input);
    }),
});

export default userCredentialsRouter;
