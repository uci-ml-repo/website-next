import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const bookmarkCreateRouter = router({
  addBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return service.bookmark.create.addBookmark({
        datasetId: input.datasetId,
        userId: ctx.user.id,
      });
    }),
});

export default bookmarkCreateRouter;
