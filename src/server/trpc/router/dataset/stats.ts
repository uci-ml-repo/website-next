import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetStatsRouter = router({
  maxDataSize: procedure.query(() => service.dataset.stats.maxDataSize()),
});
