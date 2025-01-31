import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";
import { z } from "zod";

import type { createContext } from "@/server/trpc/context";
import { AssertOwner } from "@/server/trpc/middleware/lib/owner";
import type { MiddlewareRole } from "@/server/trpc/middleware/lib/roles";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC
  .context<typeof createContext>()
  .meta<{ requireRoles?: MiddlewareRole[] }>()
  .create({ transformer });

export const protectedProcedure = t.procedure
  .input(
    z.object({
      datasetId: z.number().optional(),
      draftDatasetId: z.string().optional(),
      discussionId: z.string().optional(),
      discussionCommentId: z.string().optional(),
    }),
  )
  .use(async ({ ctx, meta, input, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (!meta?.requireRoles) {
      return next({
        ctx: {
          user: ctx.session.user,
        },
      });
    }

    const inputCast = input as unknown as {
      datasetId?: number;
      draftDatasetId?: string;
      discussionId?: string;
      discussionCommentId?: string;
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

    if (requireRoles.has(MiddlewareRoles.DISCUSSION_AUTHOR)) {
      await AssertOwner.discussion({
        discussionId: inputCast.discussionId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DISCUSSION_AUTHOR);
    }

    if (requireRoles.has(MiddlewareRoles.DISCUSSION_COMMENT_AUTHOR)) {
      await AssertOwner.discussionComment({
        discussionCommentId: inputCast.discussionCommentId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DISCUSSION_COMMENT_AUTHOR);
    }

    if (requireRoles.isDisjointFrom(userRoles)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx: {
        user: ctx.session.user,
      },
    });
  });
