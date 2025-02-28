import { router } from "@/server/trpc";
import { bookmarkRouter } from "@/server/trpc/router/bookmark";
import { datasetCiteRouter } from "@/server/trpc/router/dataset/cite";
import { datasetCountRouter } from "@/server/trpc/router/dataset/count";
import { datasetCreateRouter } from "@/server/trpc/router/dataset/create";
import { datasetFindRouter } from "@/server/trpc/router/dataset/find";
import { datasetRemoveRouter } from "@/server/trpc/router/dataset/remove";
import { datasetReportRouter } from "@/server/trpc/router/dataset/report";
import { datasetStatsRouter } from "@/server/trpc/router/dataset/stats";
import { datasetUpdateRouter } from "@/server/trpc/router/dataset/update";

export const datasetRouter = router({
  bookmarks: bookmarkRouter,
  cite: datasetCiteRouter,
  count: datasetCountRouter,
  create: datasetCreateRouter,
  find: datasetFindRouter,
  report: datasetReportRouter,
  stats: datasetStatsRouter,
  update: datasetUpdateRouter,
  remove: datasetRemoveRouter,
});
