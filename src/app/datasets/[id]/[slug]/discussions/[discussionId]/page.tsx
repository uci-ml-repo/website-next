import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import DiscussionComments from "@/components/discussion/comment/DiscussionComments";
import DiscussionUpvote from "@/components/discussion/view/DiscussionUpvote";
import DiscussionExtendedOptions from "@/components/discussion/view/extended/DiscussionExtendedOptions";
import MDXViewer from "@/components/editor/MDXViewer";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ui/profile-avatar";
import { timeSince } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string; discussionId: string }>;
}) {
  const discussion = await caller.discussion.find.byId(
    (await params).discussionId,
  );

  if (!discussion) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="flex min-w-0 items-center space-x-4">
            <Button asChild variant="outline" size="icon">
              <Link href=".">
                <ArrowLeftIcon />
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <ProfileAvatar
                src={discussion.user.image}
                className="mr-2 size-8 max-sm:hidden"
              />
              <div className="min-w-0">
                <div className="space-x-1.5 text-xs text-muted-foreground">
                  <span>{discussion.user.name}</span>
                  <span>&middot; {timeSince(discussion.createdAt)} ago</span>
                  {discussion.updatedAt && (
                    <span>(edited {timeSince(discussion.updatedAt)} ago)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <DiscussionUpvote discussion={discussion} />
            <DiscussionExtendedOptions discussion={discussion} />
          </div>
        </div>
        <h1 className="overflow-hidden overflow-ellipsis text-pretty text-2xl font-bold">
          {discussion.title}
        </h1>
        <MDXViewer markdown={discussion.content} />
      </div>
      <hr />
      <DiscussionComments discussion={discussion} />
    </div>
  );
}
