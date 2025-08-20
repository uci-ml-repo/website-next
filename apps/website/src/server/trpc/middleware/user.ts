import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { procedure } from "@/server/trpc";

export const userAccessProcedure = procedure
  .input(z.object({ userId: z.string() }))
  .use(async ({ input, ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Must be authorized to access user data",
      });
    }

    if (ctx.session.user.id !== input.userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot access data of other user",
      });
    }

    return next();
  });
