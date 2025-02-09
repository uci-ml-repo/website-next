import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetStatsRouter = router({
  maxDataSize: procedure.query(async () => {
    return service.dataset.stats.maxDataSize();
  }),
});
