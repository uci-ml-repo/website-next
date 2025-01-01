import z from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const bookmarksDeleteRouter = router({
  removeBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return service.bookmarks.remove.removeBookmark({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),
});

export default bookmarksDeleteRouter;
