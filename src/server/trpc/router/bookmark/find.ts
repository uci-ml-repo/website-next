import { z } from "zod";

import { bookmarkQuery } from "@/server/schema/bookmark";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const bookmarkFindRouter = router({
  byUserQuery: protectedProcedure
    .input(bookmarkQuery)
    .query(({ input, ctx }) =>
      service.bookmark.find.byUserQuery(input, ctx.user),
    ),

  isBookmarked: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .query(({ input }) =>
      service.bookmark.find.isBookmarked({
        datasetId: input.datasetId,
        userId: input.userId,
      }),
    ),
});
