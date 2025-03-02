import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DATASET_FILES_ZIP_PATH } from "@/lib/routes";
import { service } from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset-access";

export const fileZipRouter = router({
  unzip: fileAccessProcedure
    .unstable_concat(datasetAccessProcedure)
    .input(z.object({ path: z.string(), datasetId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const existingDataset = await service.dataset.find.byId(input.datasetId);

      if (DATASET_FILES_ZIP_PATH(existingDataset) !== input.path) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Dataset id ${input.datasetId} does not have a zip at ${input.path}`,
        });
      }

      return service.file.zip.unzip({
        absolutePath: ctx.realPath,
        datasetId: input.datasetId,
      });
    }),
});
