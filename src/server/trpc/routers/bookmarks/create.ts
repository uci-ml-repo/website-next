import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const bookmarksCreateRouter = router({
  addBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return service.bookmarks.create.addBookmark({
          datasetId: input.datasetId,
          userId: input.userId,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
          });
        }
      }
    }),
});

export default bookmarksCreateRouter;
