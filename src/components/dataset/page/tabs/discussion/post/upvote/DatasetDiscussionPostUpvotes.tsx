"use client";

import { TriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DatasetDiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetDiscussionPostUpvotesProps {
  discussion: DatasetDiscussionResponse;
}

export default function DatasetDiscussionPostUpvotes({
  discussion,
}: DatasetDiscussionPostUpvotesProps) {
  const upvoteMutation = trpc.discussions.upvote.create.useMutation();
  const removeUpvoteMutation = trpc.discussions.upvote.remove.useMutation();

  return (
    <Button variant="outline" size="sm" className="flex items-center">
      <span className="w-1/2">
        <TriangleIcon />
      </span>
      <Separator orientation="vertical" />
      <span className="w-1/2">{discussion.upvoteCount}</span>
    </Button>
  );
}
