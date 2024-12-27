import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";

import type { createContext } from "@/server/trpc/context";
import { AssertOwner } from "@/server/trpc/middleware/lib/owner";
import type { MiddlewareRole } from "@/server/trpc/middleware/lib/roles";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC
  .context<typeof createContext>()
  .meta<{ requireRoles?: MiddlewareRole[] }>()
  .create({ transformer });

export const protectedProcedure = t.procedure.use(
  async ({ ctx, meta, input, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const nextCtx = next({
      ctx: {
        user: ctx.session.user,
      },
    });

    if (!meta?.requireRoles) {
      return nextCtx;
    }

    const inputCast = input as unknown as {
      datasetId?: number;
      draftDatasetId?: string;
      discussionPostId?: string;
    };

    const requireRoles = new Set<MiddlewareRole>(meta.requireRoles);
    const userRoles = new Set<MiddlewareRole>([ctx.session.user.role]);

    if (requireRoles.has(MiddlewareRoles.DATASET_OWNER)) {
      await AssertOwner.dataset({
        datasetId: inputCast.datasetId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DATASET_OWNER);
    }

    if (requireRoles.has(MiddlewareRoles.DATASET_DRAFT_OWNER)) {
      await AssertOwner.draftDataset({
        draftDatasetId: inputCast.draftDatasetId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DATASET_DRAFT_OWNER);
    }

    if (requireRoles.has(MiddlewareRoles.DISCUSSION_AUTHOR)) {
      await AssertOwner.discussionPost({
        discussionPostId: inputCast.discussionPostId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DISCUSSION_AUTHOR);
    }

    if (requireRoles.isDisjointFrom(userRoles)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return nextCtx;
  },
);
