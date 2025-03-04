import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetReportRouter = router({
  create: procedure
    .input(
      z.object({
        datasetId: z.number(),
        reason: z.enum(enumToArray(Enums.DatasetReportReason)),
        details: z.string(),
        userId: z.string().optional(),
      }),
    )
    .mutation(({ input }) => service.dataset.report.create(input)),

  resolve: procedure
    .input(
      z.object({
        reportId: z.string(),
      }),
    )
    .mutation(({ input }) => service.dataset.report.resolve(input)),
});
