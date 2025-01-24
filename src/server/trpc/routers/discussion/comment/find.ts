import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const discussionCommentFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.discussion.comment.find.byId(input);
  }),
});

export default discussionCommentFindRouter;
