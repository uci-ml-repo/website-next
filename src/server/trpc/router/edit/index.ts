import { router } from "@/server/trpc";
import { editFindRouter } from "@/server/trpc/router/edit/find";

export const editRouter = router({
  find: editFindRouter,
});
