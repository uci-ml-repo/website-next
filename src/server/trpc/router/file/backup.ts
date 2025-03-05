import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetFilesUpdateProcedure } from "@/server/trpc/middleware/dataset-files-update";

export const fileBackupRouter = router({
  renameToBackup: datasetFilesUpdateProcedure
    .input(
      z.object({
        path: z.string(),
        datasetId: z.number(),
        overwrite: z.boolean().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.file.backup.renameToBackup({
        absolutePath: ctx.absolutePath,
        overwrite: input.overwrite,
      }),
    ),

  renameToRestore: datasetFilesUpdateProcedure
    .input(
      z.object({
        path: z.string(),
        datasetId: z.number(),
        overwrite: z.boolean().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.file.backup.renameToRestore({
        absolutePath: ctx.absolutePath,
        overwrite: input.overwrite,
      }),
    ),
});
