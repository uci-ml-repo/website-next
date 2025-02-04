import { z } from "zod";

import service from "@/server/service";
import { bookmarkQuery } from "@/server/service/schema/bookmark";
import { protectedProcedure, router } from "@/server/trpc";

const bookmarkFindRouter = router({
  byUserQuery: protectedProcedure
    .input(bookmarkQuery)
    .query(async ({ input, ctx }) => {
      return service.bookmark.find.byUserQuery(input, ctx.user);
    }),

  isBookmarked: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .query(async ({ input }) => {
      return service.bookmark.find.isBookmarked({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),
});

export default bookmarkFindRouter;
