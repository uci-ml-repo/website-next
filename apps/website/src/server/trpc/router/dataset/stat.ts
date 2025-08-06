import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetStatRouter = router({
  maxInstanceCount: procedure.query(() => service.dataset.stat.maxInstanceCount()),
  maxFeatureCount: procedure.query(() => service.dataset.stat.maxFeatureCount()),
});
