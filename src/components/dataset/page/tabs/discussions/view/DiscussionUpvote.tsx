"use client";

import { ChevronUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionUpvoteProps {
  discussion: DiscussionResponse;
}

export default function DiscussionUpvote({
  discussion,
}: DiscussionUpvoteProps) {
  const { data: session } = useSession();

  const utils = trpc.useUtils();

  const upvoteMutation = trpc.discussions.upvote.create.useMutation({
    onSuccess: async () => {
      await utils.discussions.upvote.find.invalidate({
        discussionId: discussion.id,
        userId: session?.user.id!,
      });
    },
    onError: (error) => {
      toast({
        title: "Error upvoting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeUpvoteMutation = trpc.discussions.upvote.remove.useMutation({
    onSuccess: async () => {
      await utils.discussions.upvote.find.invalidate({
        discussionId: discussion.id,
        userId: session?.user.id!,
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing upvote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <SignInRequired
      title="Sign in to upvote comments"
      body="To upvote comments and access other features, please sign in"
      authedAction={() => {}}
      session={session}
    >
      <Button variant="outline" size="sm" className="flex items-center">
        <ChevronUpIcon />
        <Separator orientation="vertical" />
        <span>{discussion.upvoteCount.toLocaleString()}</span>
      </Button>
    </SignInRequired>
  );
}
