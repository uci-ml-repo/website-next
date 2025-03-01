import Link from "next/link";
import React from "react";

import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { DATASET_DISCUSSION_ROUTE } from "@/lib/routes";
import type { DiscussionResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DiscussionMiniRow({
  discussion,
  className,
}: {
  discussion: DiscussionResponse;
  className?: string;
}) {
  return (
    <Link
      href={DATASET_DISCUSSION_ROUTE({
        id: discussion.dataset.id,
        slug: discussion.dataset.slug,
        discussionId: discussion.id,
      })}
      className={cn(
        "group flex h-10 items-center space-x-2 rounded-lg p-1.5 hover:bg-accent",
        className,
      )}
    >
      <ProfileAvatar src={discussion.user.image} className="size-7" />
      <div className="truncate text-base font-bold group-hover:underline">
        {discussion.title}
      </div>
    </Link>
  );
}
