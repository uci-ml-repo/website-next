import { z } from "zod";

import { Enums } from "@/db/lib/enums";
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
    .mutation(({ input }) => service.report.discussionComment.create(input)),

  resolve: procedure
    .input(
      z.object({
        reportId: z.string(),
      }),
    )
    .mutation(async ({ input }) =>
      service.report.discussionComment.resolve(input),
    ),
});
