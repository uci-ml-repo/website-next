import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const discussionUpvoteRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.discussion.upvote.create({
        userId: ctx.user.id,
        discussionId: input.discussionId,
      }),
    ),

  remove: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.discussion.upvote.remove({
        userId: ctx.user.id,
        discussionId: input.discussionId,
      }),
    ),
});
