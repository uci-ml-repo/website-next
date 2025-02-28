import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const datasetUpdateRouter = router({
  zipStats: datasetUpdateProcedure
    .meta({
      requireRoles: [MiddlewareRoles.ADMIN, MiddlewareRoles.DATASET_OWNER],
    })
    .input(
      z.object({
        datasetId: z.number(),
      }),
    )
    .mutation(({ ctx }) => service.dataset.update.zipStats(ctx.dataset)),
});
