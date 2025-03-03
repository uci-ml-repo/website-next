import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";
import { z } from "zod";

import { service } from "@/server/service";
import type { createContext } from "@/server/trpc/context";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const datasetUpdateProcedure = t.procedure
  .input(
    z.object({
      datasetId: z.number(),
    }),
  )
  .use(async ({ ctx, input, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const privileged = isPriviliged(ctx.session.user.role);

    const dataset = await service.dataset.find.byId(input.datasetId);

    if (!privileged) {
      if (!dataset) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (dataset.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    }

    const response = await next({
      ctx: {
        ...ctx,
        user: ctx.session.user,
        requireApproval: !privileged,
        dataset,
      },
    });

    await service.dataset.update.refreshView(input.datasetId);

    return response;
  });
