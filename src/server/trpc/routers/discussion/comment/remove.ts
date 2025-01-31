import { z } from "zod";

import { Enums } from "@/db/enums";
import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionCommentRemoveRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: [Enums.UserRole.ADMIN, "DISCUSSION_COMMENT_AUTHOR"] })
    .input(z.object({ discussionCommentId: z.string() }))
    .mutation(async ({ input }) => {
      return service.discussion.comment.remove.byId(input.discussionCommentId);
    }),
});

export default discussionCommentRemoveRouter;
