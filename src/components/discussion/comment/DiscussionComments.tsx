"use client";

import { ChevronDownIcon, MessageSquareTextIcon } from "lucide-react";
import React, { useState } from "react";

import { DiscussionCommentCreateButton } from "@/components/discussion/comment/create/DiscussionCommentCreateButton";
import { DiscussionCommentCreateInput } from "@/components/discussion/comment/create/DiscussionCommentCreateInput";
import { DiscussionComment } from "@/components/discussion/comment/view/DiscussionComment";
import { DiscussionsOrderBy } from "@/components/discussion/DiscussionsOrderBy";
import { useInfinitePagination } from "@/components/hooks/use-infinite-pagination";
import { BackToTop } from "@/components/ui/back-to-top";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export function DiscussionComments({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const [orderBy, setOrderBy] = useState<string>("top");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.discussion.comment.find.byQuery.useInfiniteQuery(
      {
        discussionId: discussion.id,
        order:
          orderBy === "top"
            ? { upvoteCount: "desc", createdAt: "desc" }
            : { createdAt: "desc" },
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const totalCount = data?.pages[0]?.count || 0;

  const { triggerFetchNextPage } = useInfinitePagination({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center space-x-1 text-xl font-bold">
          <MessageSquareTextIcon />
          <span>Comments</span>
        </div>
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquareTextIcon />
          <span className="text-nowrap text-lg font-bold sm:text-xl">
            {totalCount} Comment{totalCount !== 1 && "s"}
          </span>
        </div>
        {comments.length > 0 && (
          <DiscussionsOrderBy orderBy={orderBy} setOrderBy={setOrderBy} />
        )}
      </div>
      {isCommenting ? (
        <DiscussionCommentCreateInput
          discussionId={discussion.id}
          setIsCommenting={setIsCommenting}
          setOrderBy={setOrderBy}
        />
      ) : (
        <DiscussionCommentCreateButton
          text="Add Comment"
          className="max-md:w-full"
          setIsCommenting={setIsCommenting}
        />
      )}
      <div className="space-y-3">
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <DiscussionComment discussionComment={comment} />
            <hr />
          </React.Fragment>
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className="flex items-center justify-between">
        {hasNextPage && !isFetchingNextPage && (
          <Button onClick={triggerFetchNextPage} variant="blue">
            <ChevronDownIcon /> View more
          </Button>
        )}
        {comments.length > 10 && <BackToTop />}
      </div>
    </div>
  );
}
