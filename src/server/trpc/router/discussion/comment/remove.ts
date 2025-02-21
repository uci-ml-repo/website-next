import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const discussionCommentRemoveRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: [Enums.UserRole.ADMIN, "COMMENT_AUTHOR"] })
    .input(z.object({ commentId: z.string() }))
    .mutation(({ input }) =>
      service.discussion.comment.remove.byId(input.commentId),
    ),
});
