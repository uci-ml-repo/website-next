import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionsCreateRouter = router({
  fromData: protectedProcedure
    .input(z.object({ datasetId: z.number(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return service.discussions.create.fromData({
        userId: ctx.user.id,
        ...input,
      });
    }),
});

export default discussionsCreateRouter;
