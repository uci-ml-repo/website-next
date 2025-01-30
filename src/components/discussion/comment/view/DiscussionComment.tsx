"use client";

import { useSession } from "next-auth/react";

import type { DiscussionCommentResponse } from "@/lib/types";

export default function DiscussionComment({
  discussionComment,
}: {
  discussionComment: DiscussionCommentResponse;
}) {
  const { data: session, status } = useSession();

  return <div className="space-y-4">{discussionComment.content}</div>;
}
