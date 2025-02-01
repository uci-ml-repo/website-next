import Link from "next/link";

import DiscussionUpvote from "@/components/discussion/view/DiscussionUpvote";
import ProfileAvatar from "@/components/ui/profile-avatar";
import { DATASET_ROUTE } from "@/lib/routes";
import type { DiscussionResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export default function DiscussionPreview({
  discussion,
  showOnDataset,
}: {
  discussion: DiscussionResponse;
  showOnDataset?: boolean;
}) {
  return (
    <div className="group flex justify-between space-x-2 hover:bg-muted">
      <Link
        href={`${DATASET_ROUTE(discussion.dataset)}/discussions/${discussion.id}`}
        className="flex w-full min-w-0 items-center px-2 py-4 sm:px-4"
      >
        <ProfileAvatar
          src={discussion.user.image}
          className="mr-3 size-12 max-sm:hidden"
        />
        <div className="min-w-0">
          <div className="overflow-hidden text-ellipsis text-pretty text-xl font-bold group-hover:underline max-md:line-clamp-3 md:whitespace-nowrap">
            {discussion.title}
          </div>
          <div className="space-x-1.5 text-xs text-muted-foreground">
            <span>{discussion.user.name}</span>
            <span>&middot; {timeSince(discussion.createdAt)} ago</span>
            <span className="max-sm:hidden">
              {discussion.updatedAt && (
                <span>(edited {timeSince(discussion.updatedAt)} ago)</span>
              )}
              {showOnDataset && (
                <span>&middot; {discussion.dataset.title}</span>
              )}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center p-0 sm:p-4">
        <DiscussionUpvote discussion={discussion} />
      </div>
    </div>
  );
}
