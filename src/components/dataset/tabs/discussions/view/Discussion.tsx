import DiscussionUpvote from "@/components/dataset/tabs/discussions/view/DiscussionUpvote";
import DiscussionExtendedOptions from "@/components/dataset/tabs/discussions/view/extended/DiscussionExtendedOptions";
import MDXViewer from "@/components/editor/MDXViewer";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export default function Discussion({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ProfileAvatar src={discussion.user.image} className="size-8" />
              <div className="space-x-1.5">
                <span className="font-semibold">{discussion.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  &middot; {timeSince(discussion.createdAt)} ago
                </span>

                <span className="text-xs text-muted-foreground">
                  {discussion.updatedAt && (
                    <>(edited {timeSince(discussion.updatedAt)} ago)</>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <DiscussionUpvote discussion={discussion} />
              <DiscussionExtendedOptions discussion={discussion} />
            </div>
          </div>

          <MDXViewer markdown={discussion.content} />
        </div>
      </CardContent>
    </Card>
  );
}
