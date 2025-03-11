import { router } from "@/server/trpc";
import { editCreateRouter } from "@/server/trpc/router/edit/create";
import { editFindRouter } from "@/server/trpc/router/edit/find";

export const editRouter = router({
  create: editCreateRouter,
  find: editFindRouter,
});
