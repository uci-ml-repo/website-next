import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionUpvoteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussion.upvote.create({
        userId: ctx.user.id,
        discussionId: input.discussionId,
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussion.upvote.remove({
        userId: ctx.user.id,
        discussionId: input.discussionId,
      });
    }),

  find: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return service.discussion.upvote.find({
        userId: ctx.user.id,
        discussionId: input.discussionId,
      });
    }),
});

export default discussionUpvoteRouter;
