import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionsUpvoteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussions.upvote.create({
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
      return service.discussions.upvote.remove({
        userId: ctx.user.id,
        discussionId: input.discussionId,
      });
    }),
});

export default discussionsUpvoteRouter;
