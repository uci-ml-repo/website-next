import { router } from "@/server/trpc";
import bookmarkRouter from "@/server/trpc/routers/bookmarks";
import datasetsCiteRouter from "@/server/trpc/routers/datasets/cite";
import datasetsCountRouter from "@/server/trpc/routers/datasets/count";
import datasetsFindRouter from "@/server/trpc/routers/datasets/find";
import datasetsReportRouter from "@/server/trpc/routers/datasets/report";

const datasetsRouter = router({
  find: datasetsFindRouter,
  count: datasetsCountRouter,
  cite: datasetsCiteRouter,
  bookmarks: bookmarkRouter,
  report: datasetsReportRouter,
});

export default datasetsRouter;
