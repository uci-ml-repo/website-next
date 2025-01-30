"use client";

import { ChevronUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionUpvoteProps {
  discussion: DiscussionResponse;
}

export default function DiscussionUpvote({
  discussion,
}: DiscussionUpvoteProps) {
  const { data: session } = useSession();
  const [isUpvoted, setIsUpvoted] = useState<boolean>(discussion.upvoted);
  const [upvoteCount, setUpvoteCount] = useState<number>(
    discussion.upvoteCount,
  );

  const upvoteMutation = trpc.discussion.upvote.create.useMutation({
    onSettled: () => {
      setIsUpvoted(true);
    },
    onSuccess: () => {
      setUpvoteCount((prev) => prev + 1);
    },
  });

  const removeUpvoteMutation = trpc.discussion.upvote.remove.useMutation({
    onSettled: () => {
      setIsUpvoted(false);
    },
    onSuccess: () => {
      setUpvoteCount((prev) => prev - 1);
    },
  });

  function handleUpvote() {
    if (!session?.user) return;

    if (isUpvoted) {
      removeUpvoteMutation.mutate({
        discussionId: discussion.id,
        userId: session.user.id,
      });
    } else {
      upvoteMutation.mutate({
        discussionId: discussion.id,
        userId: session.user.id,
      });
    }
  }

  return (
    <SignInRequired
      title="Sign in to upvote comments"
      body="To upvote comments and access other features, please sign in"
      authedAction={handleUpvote}
      session={session}
    >
      <Button
        variant={isUpvoted ? "gold" : "secondary"}
        size="sm"
        className="flex items-center"
      >
        <ChevronUpIcon />
        <span>{upvoteCount.toLocaleString()}</span>
      </Button>
    </SignInRequired>
  );
}
