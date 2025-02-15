import { z } from "zod";

import { commentQuery } from "@/server/schema/discussion";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionCommentFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input, ctx }) => {
    return service.discussion.comment.find.byId(input, ctx.session);
  }),

  byQuery: procedure.input(commentQuery).query(async ({ input, ctx }) => {
    return service.discussion.comment.find.byQuery(input, ctx.session);
  }),
});
