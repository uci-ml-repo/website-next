import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const discussionRemoveRouter = router({
  byId: protectedProcedure
    .meta([Enums.UserRole.ADMIN, "DISCUSSION_AUTHOR"])
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(({ input }) =>
      service.discussion.remove.byId({
        discussionId: input.discussionId,
      }),
    ),
});
