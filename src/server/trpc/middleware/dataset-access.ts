import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";
import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { service } from "@/server/service";
import type { createContext } from "@/server/trpc/context";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const datasetAccessProcedure = t.procedure
  .input(z.object({ datasetId: z.number() }))
  .use(async ({ input, ctx, next }) => {
    const dataset = await service.dataset.find.byId(input.datasetId);

    if (!dataset) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (dataset.status !== Enums.ApprovalStatus.APPROVED) {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      } else if (!isPriviliged(ctx.session.user.role) && dataset.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    }

    return next({
      ctx: {
        dataset,
      },
    });
  });
