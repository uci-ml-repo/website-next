import Link from "next/link";

import DiscussionUpvote from "@/components/discussion/view/DiscussionUpvote";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionResponse } from "@/lib/types";
import { datasetPage, timeSince } from "@/lib/utils";

export default function DiscussionPreview({
  discussion,
  showOnDataset,
}: {
  discussion: DiscussionResponse;
  showOnDataset?: boolean;
}) {
  return (
    <div className="group flex justify-between hover:bg-muted">
      <Link
        href={`${datasetPage(discussion.dataset)}/discussions/${discussion.id}`}
        className="flex w-full min-w-0 items-center p-4"
      >
        <ProfileAvatar
          src={discussion.user.image}
          className="mr-3 size-12 max-sm:hidden"
        />
        <div className="min-w-0">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold group-hover:underline">
            {discussion.title}
          </div>
          <div className="space-x-1.5 text-xs text-muted-foreground">
            <span>{discussion.user.name}</span>
            <span>&middot; {timeSince(discussion.createdAt)} ago</span>
            {discussion.updatedAt && (
              <span>(edited {timeSince(discussion.updatedAt)} ago)</span>
            )}
            {showOnDataset && <span>&middot; {discussion.dataset.title}</span>}
          </div>
        </div>
      </Link>

      <DiscussionUpvote discussion={discussion} />
    </div>
  );
}
