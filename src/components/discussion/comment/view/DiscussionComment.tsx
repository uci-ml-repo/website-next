"use client";

import MDXViewer from "@/components/editor/MDXViewer";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionCommentResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export default function DiscussionComment({
  discussionComment,
}: {
  discussionComment: DiscussionCommentResponse;
}) {
  return (
    <div className="flex w-full min-w-0 p-4">
      <ProfileAvatar
        src={discussionComment.user.image}
        className="mr-3 size-12 max-sm:hidden"
      />
      <div className="pt-1">
        <div className="space-x-1.5 text-xs text-muted-foreground">
          <span>{discussionComment.user.name}</span>
          <span>&middot; {timeSince(discussionComment.createdAt)} ago</span>
          {discussionComment.updatedAt && (
            <span>(edited {timeSince(discussionComment.updatedAt)} ago)</span>
          )}
        </div>
        <MDXViewer markdown={discussionComment.content} />
      </div>
    </div>
  );
}
