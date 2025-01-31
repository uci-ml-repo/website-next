"use client";

import { ChevronUpIcon } from "lucide-react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionUpvoteProps {
  discussion: DiscussionResponse;
}

export default function DiscussionUpvote({
  discussion,
}: DiscussionUpvoteProps) {
  const [isUpvoted, setIsUpvoted] = useState<boolean>(discussion.upvoted);
  const [upvoteCount, setUpvoteCount] = useState<number>(
    discussion.upvoteCount,
  );

  const upvoteMutation = trpc.discussion.upvote.create.useMutation({
    onSuccess: () => {
      setIsUpvoted(true);
      setUpvoteCount((prev) => prev + 1);
    },
  });

  const removeUpvoteMutation = trpc.discussion.upvote.remove.useMutation({
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
        discussionId: discussion.id,
      });
    } else {
      upvoteMutation.mutate({
        discussionId: discussion.id,
      });
    }
  }

  return (
    <SignInRequired
      title="Sign in to upvote discussions"
      body="To upvote discussions and access other features, please sign in"
      authedAction={handleUpvote}
    >
      <Button
        variant={isUpvoted ? "gold" : "secondary"}
        size="sm"
        className="m-2 flex items-center"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : <ChevronUpIcon />}
        <span>{upvoteCount.toLocaleString()}</span>
      </Button>
    </SignInRequired>
  );
}
