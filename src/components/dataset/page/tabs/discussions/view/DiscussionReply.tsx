import DiscussionUpvote from "@/components/dataset/page/tabs/discussions/view/DiscussionUpvote";
import DiscussionExtendedOptions from "@/components/dataset/page/tabs/discussions/view/extended/DiscussionExtendedOptions";
import styles from "@/components/rich-text/RichText.module.css";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionResponse } from "@/lib/types";
import { cn, timeSince } from "@/lib/utils";

export default function DiscussionReply({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  return (
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
      </div>

      <div
        className={cn(styles.rich, "mx-2")}
        dangerouslySetInnerHTML={{ __html: discussion.content }}
      />

      <div className="flex items-center space-x-1">
        <DiscussionUpvote discussion={discussion} />
        <DiscussionExtendedOptions discussion={discussion} />
      </div>
    </div>
  );
}
