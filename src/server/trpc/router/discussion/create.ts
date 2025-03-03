import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const discussionCreateRouter = router({
  fromData: protectedProcedure
    .meta(["VERIFIED"])
    .input(
      z.object({
        datasetId: z.number(),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.discussion.create.fromData({
        userId: ctx.user.id,
        ...input,
      }),
    ),
});
