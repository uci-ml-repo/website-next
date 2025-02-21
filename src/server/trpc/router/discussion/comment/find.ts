import { z } from "zod";

import { commentQuery } from "@/server/schema/discussion";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionCommentFindRouter = router({
  byId: procedure
    .input(z.string())
    .query(({ input, ctx }) =>
      service.discussion.comment.find.byId(input, ctx.session),
    ),

  byQuery: procedure
    .input(commentQuery)
    .query(({ input, ctx }) =>
      service.discussion.comment.find.byQuery(input, ctx.session),
    ),
});
