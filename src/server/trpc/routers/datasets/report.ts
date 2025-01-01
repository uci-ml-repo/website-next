import { DatasetReportReason, ReportResolutionType } from "@prisma/client";
import { z } from "zod";

import { enumToArray } from "@/lib/utils";
import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetsReportRouter = router({
  create: procedure
    .input(
      z.object({
        datasetId: z.number(),
        reason: z.enum(enumToArray(DatasetReportReason)),
        details: z.string(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.datasets.report.create(input);
    }),

  resolve: procedure
    .input(
      z.object({
        reportId: z.string(),
        userId: z.string(),
        type: z.enum(enumToArray(ReportResolutionType)),
        comment: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.datasets.report.resolve(input);
    }),
});

export default datasetsReportRouter;
