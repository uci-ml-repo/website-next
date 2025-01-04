import DiscussionCreateReply from "@/components/dataset/page/tabs/discussions/view/DiscussionCreateReply";
import DiscussionReply from "@/components/dataset/page/tabs/discussions/view/DiscussionReply";
import DiscussionUpvote from "@/components/dataset/page/tabs/discussions/view/DiscussionUpvote";
import DiscussionExtendedOptions from "@/components/dataset/page/tabs/discussions/view/extended/DiscussionExtendedOptions";
import styles from "@/components/rich-text/RichText.module.css";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionResponseWithReplies } from "@/lib/types";
import { cn, timeSince } from "@/lib/utils";

export default function Discussion({
  discussion,
}: {
  discussion: DiscussionResponseWithReplies;
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
            <DiscussionUpvote discussion={discussion} />
            <DiscussionExtendedOptions discussion={discussion} />
          </div>
        </div>

        <div
          className={cn(styles.rich, "mx-2")}
          dangerouslySetInnerHTML={{ __html: discussion.content }}
        />

        <DiscussionCreateReply discussion={discussion} />

        {discussion.replies.map((reply) => (
          <DiscussionReply discussion={reply} key={reply.id} />
        ))}
      </CardContent>
    </Card>
  );
}
