import { z } from "zod";

import { Enums } from "@/db/enums";
import { enumToArray } from "@/lib/utils";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionCommentReportRouter = router({
  create: procedure
    .input(
      z.object({
        discussionCommentId: z.string(),
        reason: z.enum(enumToArray(Enums.DiscussionReportReason)),
        details: z.string().optional(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.discussion.comment.report.create(input);
    }),

  resolve: procedure
    .input(
      z.object({
        reportId: z.string(),
        userId: z.string(),
        type: z.enum(enumToArray(Enums.ReportResolutionType)),
        comment: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.discussion.comment.report.resolve(input);
    }),
});
