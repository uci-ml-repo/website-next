import { z } from "zod";

import service from "@/server/service";
import { discussionCommentQuery } from "@/server/service/schema/discussions";
import { procedure, router } from "@/server/trpc";

const discussionCommentFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.discussion.comment.find.byId(input);
  }),

  byQuery: procedure.input(discussionCommentQuery).query(async ({ input }) => {
    return service.discussion.comment.find.byQuery(input);
  }),
});

export default discussionCommentFindRouter;
