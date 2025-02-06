import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionCreateRouter = router({
  fromData: protectedProcedure
    .meta({ requireRoles: ["VERIFIED"] })
    .input(
      z.object({
        datasetId: z.number(),
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return service.discussion.create.fromData({
        userId: ctx.user.id,
        ...input,
      });
    }),
});

export default discussionCreateRouter;
