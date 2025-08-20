import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";
import { userAccessProcedure } from "@/server/trpc/middleware/user";

export const bookmarkDeleteRouter = router({
  removeBookmark: userAccessProcedure
    .concat(datasetAccessProcedure)
    .mutation(async ({ input }) => service.bookmark.delete.removeBookmark(input)),
});
