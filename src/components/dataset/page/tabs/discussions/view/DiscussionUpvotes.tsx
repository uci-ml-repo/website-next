"use client";

import { ChevronUpIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DatasetDiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetDiscussionPostUpvotesProps {
  discussion: DatasetDiscussionResponse;
}

export default function DiscussionUpvotes({
  discussion,
}: DatasetDiscussionPostUpvotesProps) {
  const { data: session } = useSession();

  const [isUpvoted, setIsUpvoted] = useState<boolean>(
    discussion.upvotes.some((upvote) => upvote.userId === session?.user.id),
  );

  const upvoteMutation = trpc.discussions.upvote.create.useMutation();
  const removeUpvoteMutation = trpc.discussions.upvote.remove.useMutation();

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
