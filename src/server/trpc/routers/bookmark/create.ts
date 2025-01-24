import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const bookmarkCreateRouter = router({
  addBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return service.bookmark.create.addBookmark({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),
});

export default bookmarkCreateRouter;
