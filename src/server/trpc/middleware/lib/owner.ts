import { TRPCError } from "@trpc/server";

import { service } from "@/server/service";

export namespace AssertOwner {
  export const dataset = async ({ datasetId, userId }: { datasetId: number; userId: string }) => {
    const dataset = await service.dataset.find.byId(datasetId);

    if (!dataset) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (dataset.userId !== userId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
  };

  export const discussion = async ({
    discussionId,
    userId,
  }: {
    discussionId: string;
    userId: string;
  }) => {
    const discussion = await service.discussion.find.byId(discussionId);

    if (!discussion) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (discussion.userId !== userId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
  };

  export const discussionComment = async ({
    discussionCommentId,
    userId,
  }: {
    discussionCommentId: string;
    userId: string;
  }) => {
    const discussionComment = await service.discussion.comment.find.byId(discussionCommentId);

    if (!discussionComment) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (discussionComment.userId !== userId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
  };
}
