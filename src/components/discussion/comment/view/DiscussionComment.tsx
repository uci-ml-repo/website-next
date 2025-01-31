"use client";

import { useState } from "react";

import DiscussionCommentEdit from "@/components/discussion/comment/edit/DiscussionCommentEdit";
import DiscussionCommentUpvote from "@/components/discussion/comment/view/DiscussionCommentUpvote";
import DiscussionCommentExtendedOptions from "@/components/discussion/comment/view/extended/DiscussionCommentExtendedOptions";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionCommentResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export default function DiscussionComment({
  discussionComment,
}: {
  discussionComment: DiscussionCommentResponse;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="flex justify-between">
      <div className="flex w-full py-4">
        <ProfileAvatar
          src={discussionComment.user.image}
          className="mr-3 size-12 max-sm:hidden"
        />
        <div className="w-full">
          <div className="space-x-1.5 text-xs text-muted-foreground">
            <span>{discussionComment.user.name}</span>
            <span>&middot; {timeSince(discussionComment.createdAt)} ago</span>
            {discussionComment.updatedAt && (
              <span>(edited {timeSince(discussionComment.updatedAt)} ago)</span>
            )}
          </div>
          {isEditing ? (
            <DiscussionCommentEdit
              discussionComment={discussionComment}
              setIsEditing={setIsEditing}
            />
          ) : (
            <p>{discussionComment.content}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center">
          <DiscussionCommentUpvote discussionComment={discussionComment} />
          <DiscussionCommentExtendedOptions
            discussionComment={discussionComment}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </div>
  );
}
