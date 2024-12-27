import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";
import z from "zod";

import type { createContext } from "@/server/trpc/context";
import { AssertOwner } from "@/server/trpc/middleware/lib/owner";
import type { MiddlewareRole } from "@/server/trpc/middleware/lib/roles";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC
  .context<typeof createContext>()
  .meta<{ requireRoles?: MiddlewareRole[] }>()
  .create({ transformer });

export const protectedProcedure = t.procedure
  .input(z.any())
  .use(async ({ ctx, meta, input, next }) => {
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

    const requireRoles = new Set<MiddlewareRole>(meta.requireRoles);
    const userRoles = new Set<MiddlewareRole>([ctx.session.user.role]);

    if (requireRoles.has(MiddlewareRoles.DATASET_OWNER)) {
      await AssertOwner.dataset({
        datasetId: input.datasetId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DATASET_OWNER);
    }

    if (requireRoles.has(MiddlewareRoles.DATASET_DRAFT_OWNER)) {
      await AssertOwner.draftDataset({
        draftDatasetId: input.draftDatasetId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DATASET_DRAFT_OWNER);
    }

    if (requireRoles.has(MiddlewareRoles.DISCUSSION_POST_OWNER)) {
      await AssertOwner.discussionPost({
        discussionPostId: input.discussionPostId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DISCUSSION_POST_OWNER);
    }

    if (requireRoles.isDisjointFrom(userRoles)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return nextCtx;
  });
