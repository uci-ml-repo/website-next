import { router } from "@/server/trpc";
import { bookmarkRouter } from "@/server/trpc/router/bookmark";
import { datasetCiteRouter } from "@/server/trpc/router/dataset/cite";
import { datasetCountRouter } from "@/server/trpc/router/dataset/count";
import { datasetFindRouter } from "@/server/trpc/router/dataset/find";
import { datasetReportRouter } from "@/server/trpc/router/dataset/report";
import { datasetStatsRouter } from "@/server/trpc/router/dataset/stats";

export const datasetRouter = router({
  bookmarks: bookmarkRouter,
  cite: datasetCiteRouter,
  count: datasetCountRouter,
  find: datasetFindRouter,
  report: datasetReportRouter,
  stats: datasetStatsRouter,
});
