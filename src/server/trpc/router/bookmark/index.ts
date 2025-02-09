import { router } from "@/server/trpc";
import { bookmarkCreateRouter } from "@/server/trpc/router/bookmark/create";
import { bookmarkFindRouter } from "@/server/trpc/router/bookmark/find";
import { bookmarkRemoveRouter } from "@/server/trpc/router/bookmark/remove";

export const bookmarkRouter = router({
  find: bookmarkFindRouter,
  create: bookmarkCreateRouter,
  remove: bookmarkRemoveRouter,
});
