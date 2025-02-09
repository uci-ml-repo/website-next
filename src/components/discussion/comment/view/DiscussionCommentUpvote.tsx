"use client";

import { ChevronUpIcon } from "lucide-react";
import { useState } from "react";

import { SignInRequired } from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { DiscussionCommentResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionCommentUpvoteProps {
  discussionComment: DiscussionCommentResponse;
}

export function DiscussionCommentUpvote({
  discussionComment,
}: DiscussionCommentUpvoteProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>(
    discussionComment.upvoted,
  );
  const [upvoteCount, setUpvoteCount] = useState<number>(
    discussionComment.upvoteCount,
  );

  const upvoteMutation = trpc.discussion.comment.upvote.create.useMutation({
    onSuccess: () => {
      setIsUpvoted(true);
      setUpvoteCount((prev) => prev + 1);
    },
  });

  const removeUpvoteMutation =
    trpc.discussion.comment.upvote.remove.useMutation({
      onSuccess: () => {
        setIsUpvoted(false);
        setUpvoteCount((prev) => prev - 1);
      },
    });

  const isPending = upvoteMutation.isPending || removeUpvoteMutation.isPending;

  function handleUpvote() {
    if (isPending) {
      return;
    }
    if (isUpvoted) {
      removeUpvoteMutation.mutate({
        discussionCommentId: discussionComment.id,
      });
    } else {
      upvoteMutation.mutate({
        discussionCommentId: discussionComment.id,
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
        disabled={isPending}
        aria-label={isUpvoted ? "Remove upvote" : "Upvote comment"}
      >
        {isPending ? <Spinner /> : <ChevronUpIcon />}
        <span>{upvoteCount.toLocaleString()}</span>
      </Button>
    </SignInRequired>
  );
}
