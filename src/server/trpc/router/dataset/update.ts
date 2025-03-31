import { TRPCError } from "@trpc/server";
import fs from "fs-extra";
import { z } from "zod";

import { DATASET_FILES_ZIP_LOCK_PATH, DATASET_FILES_ZIP_PENDING_LOCK_PATH } from "@/lib/routes";
import { absoluteStaticPath } from "@/lib/utils/file";
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
    .input(z.object({ datasetId: z.number(), title: z.string() }))
    .mutation(({ input, ctx }) => {
      const zipLock = absoluteStaticPath(DATASET_FILES_ZIP_LOCK_PATH(ctx.dataset));

      const zipPendingLock = absoluteStaticPath(DATASET_FILES_ZIP_PENDING_LOCK_PATH(ctx.dataset));

      if (fs.existsSync(zipLock) || fs.existsSync(zipPendingLock)) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Cannot update dataset title while files are being processed. Please try again later.",
        });
      }

      return service.dataset.update.title(input);
    }),

  hasGraphics: datasetUpdateProcedure
    .input(z.object({ datasetId: z.number(), hasGraphics: z.boolean() }))
    .mutation(({ input }) => service.dataset.update.hasGraphics(input)),
});
