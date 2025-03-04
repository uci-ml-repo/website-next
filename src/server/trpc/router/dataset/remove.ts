import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";
import { canDeleteDataset } from "@/server/trpc/middleware/lib/roles";

export const datasetRemoveRouter = router({
  byId: datasetUpdateProcedure
    .input(z.object({ datasetId: z.number() }))
    .mutation(({ input, ctx }) => {
      if (!canDeleteDataset({ user: ctx.user, dataset: ctx.dataset })) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return service.dataset.remove.byId(input.datasetId);
    }),
});
