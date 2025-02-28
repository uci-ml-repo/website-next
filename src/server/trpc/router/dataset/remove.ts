import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";

export const datasetRemoveRouter = router({
  byId: datasetUpdateProcedure
    .input(z.object({ datasetId: z.number() }))
    .mutation(({ input }) => service.dataset.remove.byId(input.datasetId)),
});
