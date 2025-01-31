"use client";

import { useState } from "react";
import { z } from "zod";

import DiscussionCommentEdit from "@/components/discussion/comment/edit/DiscussionCommentEdit";
import DiscussionCommentUpvote from "@/components/discussion/comment/view/DiscussionCommentUpvote";
import DiscussionCommentExtendedOptions from "@/components/discussion/comment/view/extended/DiscussionCommentExtendedOptions";
import MDXViewer from "@/components/editor/MDXViewer";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DiscussionCommentResponse } from "@/lib/types";
import { timeSince } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment is required" }),
});

export default function DiscussionComment({
  discussionComment,
}: {
  discussionComment: DiscussionCommentResponse;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const updateMutation = trpc.discussion.comment.update.byId.useMutation();

  return (
    <div className="flex justify-between">
      <div className="flex w-full py-4">
        <ProfileAvatar
          src={discussionComment.user.image}
          className="mr-3 size-12 max-sm:hidden"
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
            <MDXViewer markdown={discussionComment.content} />
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
