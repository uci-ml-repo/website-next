"use client";

import { MessageSquareTextIcon } from "lucide-react";

import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export default function DiscussionComments({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const commentsQuery = trpc.discussion.comment.find.byQuery.useQuery({
    discussionId: discussion.id,
  });

  return (
    <div>
      <div className="flex items-center space-x-1 text-xl font-bold">
        <MessageSquareTextIcon />
        <div> {0} Comments</div>
      </div>
    </div>
  );
}
