import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetCountRouter = router({
  approved: procedure.query(() => service.dataset.count.approved()),
});
