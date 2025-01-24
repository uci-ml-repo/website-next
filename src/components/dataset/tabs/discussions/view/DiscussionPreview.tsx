import Link from "next/link";

import DiscussionUpvote from "@/components/dataset/tabs/discussions/view/DiscussionUpvote";
import DiscussionExtendedOptions from "@/components/dataset/tabs/discussions/view/extended/DiscussionExtendedOptions";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export default function DiscussionPreview({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  return (
    <Card className="group hover:bg-muted/50">
      <Link href={`discussions/${discussion.id}`}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex min-w-0 items-center">
                <ProfileAvatar
                  src={discussion.user.image}
                  className="mr-2 size-12 max-sm:hidden"
                />
                <div className="min-w-0">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold group-hover:underline">
                    {discussion.title}
                  </div>
                  <div className="space-x-1.5 text-xs text-muted-foreground">
                    <span>{discussion.user.name}</span>
                    <span>&middot; {timeSince(discussion.createdAt)} ago</span>
                    {discussion.updatedAt && (
                      <span>
                        (edited {timeSince(discussion.updatedAt)} ago)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-1">
                <DiscussionUpvote discussion={discussion} />
                <DiscussionExtendedOptions discussion={discussion} />
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
