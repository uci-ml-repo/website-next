import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionUpvoteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.discussion.upvote.create({
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
      return service.discussion.upvote.remove({
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
      return service.discussion.upvote.find({
        userId: input.userId,
        discussionId: input.discussionId,
      });
    }),
});

export default discussionUpvoteRouter;
