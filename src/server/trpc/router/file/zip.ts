import { z } from "zod";

import { service } from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";
// import { datasetUpdateProcedure } from "@/server/trpc/middleware/dataset-update";

export const fileZipRouter = router({
  unzip: fileAccessProcedure
    // .unstable_concat(datasetUpdateProcedure)
    .input(z.object({ datasetId: z.number() }))
    .mutation(({ ctx }) =>
      service.file.zip.unzip({ absolutePath: ctx.realPath }),
    ),
});
