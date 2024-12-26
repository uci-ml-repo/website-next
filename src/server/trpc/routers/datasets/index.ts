import { router } from "@/server/trpc";
import datasetBookmarkRouter from "@/server/trpc/routers/datasets/bookmark";
import datasetCiteRouter from "@/server/trpc/routers/datasets/cite";
import datasetCountRouter from "@/server/trpc/routers/datasets/count";
import datasetFindRouter from "@/server/trpc/routers/datasets/find";
import datasetReportRouter from "@/server/trpc/routers/datasets/report";

const datasetsRouter = router({
  find: datasetFindRouter,
  count: datasetCountRouter,
  cite: datasetCiteRouter,
  bookmarks: datasetBookmarkRouter,
  report: datasetReportRouter,
});

export default datasetsRouter;
