import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const datasetCreateRouter = router({
  draft: protectedProcedure
    .meta({ requireRoles: [MiddlewareRoles.VERIFIED] })
    .input(z.object({ title: z.string() }))
    .mutation(({ input, ctx }) =>
      service.dataset.create.draft({ ...input, userId: ctx.user.id }),
    ),
});
