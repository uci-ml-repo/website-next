import DatasetDiscussionPostUpvotes from "@/components/dataset/page/tabs/discussion/view/upvote/DatasetDiscussionPostUpvotes";
import styles from "@/components/rich-text/RichText.module.css";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DatasetDiscussionResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export default function DatasetDiscussionPost({
  discussion,
}: {
  discussion: DatasetDiscussionResponse;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ProfileAvatar src={discussion.user.image} className="size-8" />
            <div className="space-x-1.5">
              <span className="font-semibold">{discussion.user.name}</span>
              <span className="text-xs text-muted-foreground">
                &middot; {timeSince(discussion.createdAt)} ago
              </span>
              {discussion.editedAt && (
                <span className="text-xs text-muted-foreground">
                  (edited {timeSince(discussion.editedAt)} ago)
                </span>
              )}
            </div>
          </div>
          <DatasetDiscussionPostUpvotes discussion={discussion} />
        </div>

        <div
          className={styles.rich}
          dangerouslySetInnerHTML={{ __html: discussion.content }}
        />
      </CardContent>
    </Card>
  );
}
