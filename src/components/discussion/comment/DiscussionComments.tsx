"use client";

import { MessageSquareTextIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import DiscussionCommentCreateButton from "@/components/discussion/comment/create/DiscussionCommentCreateButton";
import DiscussionCommentCreateInput from "@/components/discussion/comment/create/DiscussionCommentCreateInput";
import DiscussionComment from "@/components/discussion/comment/view/DiscussionComment";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import Spinner from "@/components/ui/spinner";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export type DiscussionCommentsOrderBy = "top" | "new";

export default function DiscussionComments({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const [orderBy, setOrderBy] = useState<DiscussionCommentsOrderBy>("top");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  const comments = data?.pages.flatMap((page) => page.discussionComments) || [];
  const totalCount = data?.pages[0]?.count || 0;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    const currentElement = loadMoreRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          authedAction={() => setIsCommenting(true)}
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

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
