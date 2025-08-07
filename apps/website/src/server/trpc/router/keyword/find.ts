import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const keywordFindRouter = router({
  approved: procedure.query(() => service.keyword.find.approved()),
});
