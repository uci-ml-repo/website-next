"use client";

import { MessageSquareTextIcon } from "lucide-react";

import Spinner from "@/components/ui/spinner";
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
      {commentsQuery.data ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-xl font-bold">
            <MessageSquareTextIcon />
            <span>{commentsQuery.data.count} Comments</span>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
