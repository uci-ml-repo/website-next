import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const discussionCommentRemoveRouter = router({
  byId: protectedProcedure
    .meta([Enums.UserRole.ADMIN, MiddlewareRoles.COMMENT_AUTHOR])
    .input(z.object({ commentId: z.string() }))
    .mutation(({ input }) =>
      service.discussion.comment.remove.byId(input.commentId),
    ),
});
