import { Enums } from "@packages/db/enum";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { service } from "@/server/service";
import { procedure } from "@/server/trpc";
import { isPriviliged } from "@/server/trpc/middleware/util/role";

export const datasetAccessProcedure = procedure
  .input(z.object({ datasetId: z.number() }))
  .use(async ({ input, ctx, next }) => {
    const dataset = await service.dataset.find.byId(input.datasetId);

    if (!dataset) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Dataset not found",
      });
    }

    if (dataset.status !== Enums.ApprovalStatus.APPROVED) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User must be authorized to access unapproved datasets",
        });
      } else if (!isPriviliged(ctx.session.user.role) && dataset.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Use is forbidden from accessing unapproved datasets",
        });
      }
    }

    return next({ ctx: { dataset } });
  });
