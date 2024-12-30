import DatasetDiscussionReply from "@/components/dataset/page/tabs/discussions/view/DiscussionReply";
import DiscussionUpvotes from "@/components/dataset/page/tabs/discussions/view/DiscussionUpvotes";
import DiscussionExtendedOptions from "@/components/dataset/page/tabs/discussions/view/extended/DiscussionExtendedOptions";
import styles from "@/components/rich-text/RichText.module.css";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DatasetDiscussionResponse } from "@/lib/types";
import { cn, timeSince } from "@/lib/utils";

export default function Discussion({
  discussion,
}: {
  discussion: DatasetDiscussionResponse;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ProfileAvatar src={discussion.user.image} className="size-8" />
            <div className="space-x-1.5">
              <span className="font-semibold">{discussion.user.name}</span>
              <span className="text-xs text-muted-foreground">
                &middot; {timeSince(discussion.createdAt)} ago
              </span>

              <span className="text-xs text-muted-foreground">
                {discussion.deletedAt ? (
                  <>(deleted {timeSince(discussion.deletedAt)} ago)</>
                ) : (
                  discussion.editedAt && (
                    <>(edited {timeSince(discussion.editedAt)} ago)</>
                  )
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <DiscussionUpvotes discussion={discussion} />
            <DiscussionExtendedOptions discussion={discussion} />
          </div>
        </div>

        <div
          className={cn(styles.rich, "mx-2")}
          dangerouslySetInnerHTML={{ __html: discussion.content }}
        />

        <div>
          <DatasetDiscussionReply discussion={discussion} />
        </div>
      </CardContent>
    </Card>
  );
}
