import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";

export const datasetUpdateRouter = router({
  zipStats: datasetUpdateProcedure
    .input(
      z.object({
        datasetId: z.number(),
      }),
    )
    .mutation(({ ctx }) => service.dataset.update.zipStats(ctx.dataset)),

  title: datasetUpdateProcedure
    .meta({})
    .input(z.object({ title: z.string(), isExternal: z.boolean() }))
    .mutation(({ input }) => service.dataset.update.title(input)),
});
