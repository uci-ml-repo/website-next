import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetFilesUpdateProcedure } from "@/server/trpc/middleware/dataset-files-update";

export const fileZipRouter = router({
  unzip: datasetFilesUpdateProcedure
    .input(
      z.object({
        path: z.string(),
        datasetId: z.number(),
        overwrite: z.boolean().optional(),
        updateZipStats: z.boolean().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.file.zip.unzip({
        absolutePath: ctx.absolutePath,
        ...input,
      }),
    ),
});
