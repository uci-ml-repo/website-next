import bcryptjs from "bcryptjs";
import { z } from "zod";

import { db } from "@/db";
import { user } from "@/db/schema";
import { service } from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";

export const userCredentialsRouter = router({
  sendResetPasswordEmail: procedure.input(z.object({ email: z.string() })).mutation(({ input }) =>
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
    .query(({ input }) => service.user.credentials.getEmailVerificationToken(input.token)),

  getResetPasswordToken: procedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) => service.user.credentials.getResetPasswordToken(input.token)),

  resetPassword: procedure
    .input(z.object({ password: z.string(), token: z.string() }))
    .mutation(({ input }) => service.user.credentials.resetPassword(input)),

  verifyEmail: procedure
    .input(z.object({ token: z.string() }))
    .mutation(({ input }) => service.user.credentials.verifyEmail(input)),

  credentialsLogin: procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const existingUser = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, input.email),
        });

        if (!existingUser) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        if (!existingUser.password) {
          return {
            success: false,
            message: `${existingUser.email} is registered with a provider. Try signing in with Google or Github`,
          };
        }

        const isPasswordMatches = bcryptjs.compareSync(input.password, existingUser.password);

        if (!isPasswordMatches) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        return { success: true, email: input.email };
      } catch (error: unknown) {
        return {
          success: false,
          message: (error as Error).message,
        };
      }
    }),

  credentialsRegister: procedure
    .input(z.object({ email: z.string(), password: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const existingUser = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, input.email),
        });

        if (existingUser) {
          return {
            success: false,
            message: "An account with this email already exists. Try signing in.",
          };
        }

        const hashedPassword = await bcryptjs.hash(input.password, 10);

        await db.insert(user).values({
          email: input.email,
          password: hashedPassword,
          name: input.name,
        });

        service.email.sendRegistrationEmail({ email: input.email, name: input.name }).then();

        return { success: true, email: input.email };
      } catch (error: unknown) {
        return {
          success: false,
          message: (error as Error).message,
        };
      }
    }),
});
