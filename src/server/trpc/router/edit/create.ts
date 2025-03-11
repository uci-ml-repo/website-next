import z from "zod";

import { service } from "@/server/service";
import { datasetEditFields } from "@/server/service/edit/create";
import { router } from "@/server/trpc";
import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";

export const editCreateRouter = router({
  editFields: datasetUpdateProcedure
    .input(z.object({ datasetId: z.number(), editFields: datasetEditFields }))
    .mutation(({ input, ctx }) =>
      service.edit.create.editFields({
        datasetId: input.datasetId,
        userId: ctx.user.id,
        editFields: input.editFields,
      }),
    ),
});
