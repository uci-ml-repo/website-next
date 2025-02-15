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
      commentId: z.string().optional(),
      userId: z.string().optional(),
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

    const requireRoles = new Set<MiddlewareRole>(meta.requireRoles);
    const userRoles = new Set<MiddlewareRole>([ctx.session.user.role]);

    if (requireRoles.has(MiddlewareRoles.VERIFIED)) {
      if (!ctx.session.user.emailVerified) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      userRoles.add(MiddlewareRoles.VERIFIED);
    }

    if (requireRoles.has(MiddlewareRoles.IS_USER_ID)) {
      if (!input.userId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (ctx.session.user.id === input.userId) {
        userRoles.add(MiddlewareRoles.IS_USER_ID);
      }
    }

    if (requireRoles.has(MiddlewareRoles.DATASET_OWNER)) {
      if (!input.datasetId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await AssertOwner.dataset({
        datasetId: input.datasetId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DATASET_OWNER);
    }

    if (requireRoles.has(MiddlewareRoles.DISCUSSION_AUTHOR)) {
      if (!input.discussionId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await AssertOwner.discussion({
        discussionId: input.discussionId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.DISCUSSION_AUTHOR);
    }

    if (requireRoles.has(MiddlewareRoles.COMMENT_AUTHOR)) {
      if (!input.commentId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await AssertOwner.discussionComment({
        commentId: input.commentId,
        userId: ctx.session.user.id,
      });

      userRoles.add(MiddlewareRoles.COMMENT_AUTHOR);
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
