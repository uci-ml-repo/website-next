import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetCountRouter = router({
  approved: procedure.query(async () => {
    return service.dataset.count.approved();
  }),
});

export default datasetCountRouter;
