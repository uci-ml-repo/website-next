"use client";

import { ChevronUpIcon } from "lucide-react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import type { DiscussionCommentResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCommentUpvoteProps {
  comment: DiscussionCommentResponse;
}

export default function DiscussionCommentUpvote({
  comment,
}: DiscussionCommentUpvoteProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>(comment.upvoted);
  const [upvoteCount, setUpvoteCount] = useState<number>(comment.upvoteCount);

  const upvoteMutation = trpc.discussion.comment.upvote.create.useMutation({
    onSettled: () => {
      setIsUpvoted(true);
    },
    onSuccess: () => {
      setUpvoteCount((prev) => prev + 1);
    },
  });

  const removeUpvoteMutation =
    trpc.discussion.comment.upvote.remove.useMutation({
      onSettled: () => {
        setIsUpvoted(false);
      },
      onSuccess: () => {
        setUpvoteCount((prev) => prev - 1);
      },
    });

  function handleUpvote() {
    if (isUpvoted) {
      removeUpvoteMutation.mutate({
        discussionCommentId: comment.id,
      });
    } else {
      upvoteMutation.mutate({
        discussionCommentId: comment.id,
      });
    }
  }

  return (
    <SignInRequired
      title="Sign in to upvote comments"
      body="To upvote comments and access other features, please sign in"
      authedAction={handleUpvote}
    >
      <Button
        variant={isUpvoted ? "gold" : "secondary"}
        size="sm"
        className="m-2 flex items-center"
      >
        <ChevronUpIcon />
        <span>{upvoteCount.toLocaleString()}</span>
      </Button>
    </SignInRequired>
  );
}
