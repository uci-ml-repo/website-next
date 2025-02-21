import { z } from "zod";

import { service } from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";

export const userCredentialsRouter = router({
  sendResetPasswordEmail: procedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) =>
      service.user.credentials.sendResetPasswordEmail({
        email: input.email,
      }),
    ),

  sendVerificationEmail: protectedProcedure.mutation(({ ctx }) =>
    service.user.credentials.sendVerificationEmail({
      userId: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
    }),
  ),

  getEmailVerificationToken: procedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) =>
      service.user.credentials.getEmailVerificationToken(input.token),
    ),

  getResetPasswordToken: procedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) =>
      service.user.credentials.getResetPasswordToken(input.token),
    ),

  resetPassword: procedure
    .input(z.object({ password: z.string(), token: z.string() }))
    .mutation(({ input }) => service.user.credentials.resetPassword(input)),

  verifyEmail: procedure
    .input(z.object({ token: z.string() }))
    .mutation(({ input }) => service.user.credentials.verifyEmail(input)),
});
