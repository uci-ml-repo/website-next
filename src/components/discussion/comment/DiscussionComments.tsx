"use client";

import { MessageSquareTextIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import DiscussionCommentCreateButton from "@/components/discussion/comment/create/DiscussionCommentCreateButton";
import DiscussionCommentCreateInput from "@/components/discussion/comment/create/DiscussionCommentCreateInput";
import DiscussionComment from "@/components/discussion/comment/view/DiscussionComment";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import { Card, CardContent } from "@/components/ui/card";
import type { DiscussionResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/query/client";

export default function DiscussionComments({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const { data: session, status } = useSession();

  const [orderBy, setOrderBy] = useState<"top" | "new">("top");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const commentsQuery = trpc.discussion.comment.find.byQuery.useQuery(
    {
      discussionId: discussion.id,
      order:
        orderBy === "top"
          ? { upvoteCount: "desc", createdAt: "desc" }
          : { createdAt: "desc" },
      limit: 10,
      offset: 0,
    },
    {
      enabled: status !== "loading",
    },
  );

  if (!commentsQuery.data || commentsQuery.isLoading) {
    return (
      <div className="flex items-center space-x-1 text-xl font-bold">
        <MessageSquareTextIcon />
        <span>Comments</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-xl font-bold">
        <MessageSquareTextIcon />
        <span>
          {commentsQuery.data.count} Comment
          {commentsQuery.data.count !== 1 && "s"}
        </span>
      </div>

      <div
        className={cn("items-center", {
          "sm:flex": !isCommenting,
          "space-y-6": isCommenting,
        })}
      >
        {isCommenting ? (
          <DiscussionCommentCreateInput
            discussionId={discussion.id}
            className="w-full"
            setIsCommenting={setIsCommenting}
          />
        ) : commentsQuery.data.discussionComments.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex h-[130px] items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="text-muted-foreground">
                  There are no comments yet
                </div>
                <DiscussionCommentCreateButton
                  text="Add Comment"
                  session={session}
                  authedAction={() => setIsCommenting(true)}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <DiscussionCommentCreateButton
            text="Add Comment"
            session={session}
            authedAction={() => setIsCommenting(true)}
            className="max-sm:w-full"
          />
        )}

        {commentsQuery.data.discussionComments.length > 0 && (
          <DiscussionsOrderBy
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            className="flex w-full justify-end"
          />
        )}
      </div>

      <div className="space-y-3">
        {commentsQuery.data.discussionComments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            {index === 0 && <hr />}
            <DiscussionComment discussionComment={comment} />
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
