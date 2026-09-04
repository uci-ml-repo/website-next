import { TRPCError } from "@trpc/server";

import { privilegedProcedure } from "@/server/trpc/middleware/privileged";
import { isAdmin } from "@/server/trpc/middleware/util/role";

export const adminProcedure = privilegedProcedure.use(({ ctx, next }) => {
  if (!isAdmin(ctx.session?.user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is forbidden from accessing admin resources",
    });
  }

  return next();
});
