import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";
import { userAccessProcedure } from "@/server/trpc/middleware/user";

export const bookmarkFindRouter = router({
  byUserId: userAccessProcedure.query(({ input }) => service.bookmark.find.byUserId(input)),

  isDatasetBookmarked: userAccessProcedure
    .concat(datasetAccessProcedure)
    .query(({ input }) => service.bookmark.find.isDatasetBookmarked(input)),
});
