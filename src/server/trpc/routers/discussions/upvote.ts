import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionsUpvoteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.discussions.upvote.create({
        userId: input.userId,
        discussionId: input.discussionId,
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.discussions.upvote.remove({
        userId: input.userId,
        discussionId: input.discussionId,
      });
    }),

  find: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        discussionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return service.discussions.upvote.find({
        userId: input.userId,
        discussionId: input.discussionId,
      });
    }),
});

export default discussionsUpvoteRouter;
