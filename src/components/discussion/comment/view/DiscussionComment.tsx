"use client";

import { useState } from "react";

import { DiscussionCommentEdit } from "@/components/discussion/comment/edit/DiscussionCommentEdit";
import { DiscussionCommentUpvote } from "@/components/discussion/comment/view/DiscussionCommentUpvote";
import { DiscussionCommentExtendedOptions } from "@/components/discussion/comment/view/extended/DiscussionCommentExtendedOptions";
import { Expandable } from "@/components/ui/expandable";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import type { DiscussionCommentResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";

export function DiscussionComment({
  discussionComment,
}: {
  discussionComment: DiscussionCommentResponse;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="flex justify-between space-x-1">
      <div className="flex w-full py-4">
        <ProfileAvatar
          src={discussionComment.user.image}
          className="mr-3 size-10 max-sm:hidden"
        />
        <div className="w-full space-y-1">
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
            <Expandable truncationHeight={100}>
              <div className="whitespace-pre-wrap">
                {discussionComment.content}
              </div>
            </Expandable>
          )}
        </div>
      </div>

      <div>
        <DiscussionCommentUpvote discussionComment={discussionComment} />
        <div className="flex justify-end">
          <DiscussionCommentExtendedOptions
            discussionComment={discussionComment}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </div>
  );
}
