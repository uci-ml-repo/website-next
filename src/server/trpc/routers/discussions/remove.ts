import { DiscussionReportReason } from "@prisma/client";
import { z } from "zod";

import { enumToArray } from "@/lib/utils";
import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionsRemoveRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: ["ADMIN", "DISCUSSION_AUTHOR"] })
    .input(
      z.object({
        discussionId: z.string(),
        reason: z.enum(enumToArray(DiscussionReportReason)).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussions.remove.byId({
        discussionId: input.discussionId,
        userId: ctx.user.id,
        deletionReason: input.reason,
      });
    }),
});

export default discussionsRemoveRouter;
