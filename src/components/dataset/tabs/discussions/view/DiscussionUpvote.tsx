"use client";

import { ChevronUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import { toast } from "@/components/hooks/use-toast";
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
  const [isUpvoted, setIsUpvoted] = useState<boolean>(false);
  const [upvoteCount, setUpvoteCount] = useState<number>(
    discussion.upvoteCount,
  );

  const upvoteMutation = trpc.discussions.upvote.create.useMutation({
    onSuccess: async () => {
      setIsUpvoted(true);
      setUpvoteCount((prev) => prev + 1);
    },
    onError: () => {
      toast({
        title: "Error upvoting",
        variant: "destructive",
      });
    },
  });

  const removeUpvoteMutation = trpc.discussions.upvote.remove.useMutation({
    onSuccess: async () => {
      setIsUpvoted(false);
      setUpvoteCount((prev) => prev - 1);
    },
    onError: () => {
      toast({
        title: "Error removing upvote",
        variant: "destructive",
      });
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
