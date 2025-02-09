import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const discussionCommentCreateRouter = router({
  fromData: protectedProcedure
    .meta({ requireRoles: ["VERIFIED"] })
    .input(
      z.object({
        discussionId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussion.comment.create.fromData({
        userId: ctx.user.id,
        ...input,
      });
    }),
});
