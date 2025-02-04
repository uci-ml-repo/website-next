import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionCommentUpvoteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        discussionCommentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussion.comment.upvote.create({
        discussionCommentId: input.discussionCommentId,
        userId: ctx.user.id,
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        discussionCommentId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussion.comment.upvote.remove({
        discussionCommentId: input.discussionCommentId,
        userId: ctx.user.id,
      });
    }),
});

export default discussionCommentUpvoteRouter;
