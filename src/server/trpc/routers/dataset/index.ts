import { router } from "@/server/trpc";
import bookmarkRouter from "@/server/trpc/routers/bookmark";
import datasetCiteRouter from "@/server/trpc/routers/dataset/cite";
import datasetCountRouter from "@/server/trpc/routers/dataset/count";
import datasetFindRouter from "@/server/trpc/routers/dataset/find";
import datasetReportRouter from "@/server/trpc/routers/dataset/report";

const datasetRouter = router({
  find: datasetFindRouter,
  count: datasetCountRouter,
  cite: datasetCiteRouter,
  bookmarks: bookmarkRouter,
  report: datasetReportRouter,
});

export default datasetRouter;
