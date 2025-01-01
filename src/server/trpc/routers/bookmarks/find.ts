import { z } from "zod";

import service from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";

const bookmarksFindRouter = router({
  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.bookmarks.find.byUserId(input);
  }),

  isBookmarked: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .query(async ({ input }) => {
      return service.bookmarks.find.isBookmarked({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),
});

export default bookmarksFindRouter;
