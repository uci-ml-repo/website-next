"use client";

import type { DiscussionCommentResponse } from "@/lib/types";

export default function DiscussionComment({
  discussionComment,
}: {
  discussionComment: DiscussionCommentResponse;
}) {
  return <div className="space-y-4">{discussionComment.content}</div>;
}
