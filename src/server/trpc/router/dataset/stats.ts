import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetStatsRouter = router({
  maxDataSize: procedure.query(async () => {
    return service.dataset.stats.maxDataSize();
  }),
});

export default datasetStatsRouter;
