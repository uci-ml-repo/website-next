import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionReportRouter = router({
  create: procedure
    .input(
      z.object({
        discussionId: z.string(),
        reason: z.enum(enumToArray(Enums.DiscussionReportReason)),
        details: z.string().optional(),
        userId: z.string().optional(),
      }),
    )
    .mutation(({ input }) => service.discussion.report.create(input)),

  resolve: procedure
    .input(
      z.object({
        reportId: z.string(),
        userId: z.string(),
        type: z.enum(enumToArray(Enums.ReportResolutionType)),
      }),
    )
    .mutation(({ input }) => service.discussion.report.resolve(input)),
});
