"use client";

import { MessageSquareTextIcon } from "lucide-react";
import React, { useState } from "react";

import DiscussionCommentCreateButton from "@/components/discussion/comment/create/DiscussionCommentCreateButton";
import DiscussionCommentCreateInput from "@/components/discussion/comment/create/DiscussionCommentCreateInput";
import DiscussionComment from "@/components/discussion/comment/view/DiscussionComment";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export default function DiscussionComments({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const [orderBy, setOrderBy] = useState<"top" | "new">("top");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const commentsQuery = trpc.discussion.comment.find.byQuery.useQuery({
    discussionId: discussion.id,
    order:
      orderBy === "top"
        ? { upvoteCount: "desc", createdAt: "desc" }
        : { createdAt: "desc" },
    limit: 10,
    offset: 0,
  });

  if (!commentsQuery.data || commentsQuery.isLoading) {
    return (
      <div className="flex items-center space-x-1 text-xl font-bold">
        <MessageSquareTextIcon />
        <span>Comments</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquareTextIcon />
          <span className="text-nowrap text-lg font-bold sm:text-xl">
            {commentsQuery.data.count} Comment
            {commentsQuery.data.count !== 1 && "s"}
          </span>
        </div>
        {commentsQuery.data.discussionComments.length > 0 && (
          <DiscussionsOrderBy orderBy={orderBy} setOrderBy={setOrderBy} />
        )}
      </div>

      {isCommenting ? (
        <DiscussionCommentCreateInput
          discussionId={discussion.id}
          setIsCommenting={setIsCommenting}
        />
      ) : (
        <DiscussionCommentCreateButton
          text="Add Comment"
          className="max-md:w-full"
          authedAction={() => setIsCommenting(true)}
        />
      )}

      <div className="space-y-3">
        {commentsQuery.data.discussionComments.map((comment) => (
          <React.Fragment key={comment.id}>
            <DiscussionComment discussionComment={comment} />
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
