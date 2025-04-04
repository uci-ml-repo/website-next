import { notFound } from "next/navigation";

import { DiscussionComments } from "@/components/discussion/comment/DiscussionComments";
import { DiscussionContent } from "@/components/discussion/view/DiscussionContent";
import { DiscussionUpvote } from "@/components/discussion/view/DiscussionUpvote";
import { DiscussionExtendedOptions } from "@/components/discussion/view/extended/DiscussionExtendedOptions";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { timeSince } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string; discussionId: string }>;
}) {
  const discussion = await caller.discussion.find.byId((await params).discussionId);

  if (!discussion) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <ScrollToTop />
      <div className="space-y-2">
        <div className="flex justify-between space-x-2">
          <div className="flex items-center">
            <ProfileAvatar src={discussion.user.image} className="mr-2 size-8 max-sm:hidden" />
            <div className="space-x-1.5 text-xs text-muted-foreground">
              <span>{discussion.user.name}</span>
              <span>&middot; {timeSince(discussion.createdAt)} ago</span>
              {discussion.updatedAt && <span>(edited {timeSince(discussion.updatedAt)} ago)</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DiscussionUpvote discussion={discussion} />
            <DiscussionExtendedOptions discussion={discussion} />
          </div>
        </div>

        <h1 className="overflow-hidden overflow-ellipsis text-pretty text-2xl font-extrabold">
          {discussion.title}
        </h1>

        <DiscussionContent content={discussion.content} />
      </div>

      <hr />

      <DiscussionComments discussion={discussion} />
    </div>
  );
}
