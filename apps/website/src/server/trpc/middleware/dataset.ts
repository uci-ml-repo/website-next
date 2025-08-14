import { Enums } from "@packages/db/enum";
import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";
import { z } from "zod";

import { service } from "@/server/service";
import type { createContext } from "@/server/trpc/context";
import { isPriviliged } from "@/server/trpc/middleware/util/role";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const datasetAccessProcedure = t.procedure
  .input(z.object({ id: z.number() }))
  .use(async ({ input, ctx, next }) => {
    const dataset = await service.dataset.find.byId(input.id);

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
