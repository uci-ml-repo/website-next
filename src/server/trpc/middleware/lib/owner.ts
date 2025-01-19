import { TRPCError } from "@trpc/server";

import service from "@/server/service";

export namespace AssertOwner {
  export const dataset = async ({
    datasetId,
    userId,
  }: {
    datasetId: number | undefined;
    userId: string;
  }) => {
    if (!datasetId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const dataset = await service.datasets.find.byId(datasetId);

    if (!dataset) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (dataset.userId !== userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  };

  export const discussion = async ({
    discussionId,
    userId,
  }: {
    discussionId: string | undefined;
    userId: string;
  }) => {
    if (!discussionId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const discussion = await service.discussions.find.byId(discussionId);

    if (!discussion) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (discussion.userId !== userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  };
}
