import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const keywordFindRouter = router({
  approved: procedure.query(async () => {
    return service.keyword.find.approved();
  }),
});

export default keywordFindRouter;
