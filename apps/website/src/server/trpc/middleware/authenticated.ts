import { TRPCError } from "@trpc/server";

import { procedure } from "@/server/trpc";

export const authenticatedProcedure = procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in to donate a dataset" });
  }

  return next({ ctx: { session: ctx.session } });
});
