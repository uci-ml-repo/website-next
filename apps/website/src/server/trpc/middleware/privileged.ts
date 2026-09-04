import { TRPCError } from "@trpc/server";

import { procedure } from "@/server/trpc";
import { isPrivileged } from "@/server/trpc/middleware/util/role";

export const privilegedProcedure = procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Must be authorized to access privileged resources",
    });
  }

  if (!isPrivileged(ctx.session.user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is forbidden from accessing privileged resources",
    });
  }

  return next();
});
