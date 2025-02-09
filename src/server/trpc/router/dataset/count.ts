import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetCountRouter = router({
  approved: procedure.query(async () => {
    return service.dataset.count.approved();
  }),
});
