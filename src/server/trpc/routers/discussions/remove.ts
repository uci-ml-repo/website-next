import { z } from "zod";

import { Enums } from "@/db/types";
import { enumToArray } from "@/lib/utils";
import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import DiscussionReportReason = Enums.DiscussionReportReason;

const discussionsRemoveRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: [Enums.UserRole.ADMIN, "DISCUSSION_AUTHOR"] })
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
