import { forbidden, notFound, unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { DiscussionEditForm } from "@/components/discussion/edit/DiscussionEditForm";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string; discussionId: string }>;
}) {
  const { discussionId } = await params;

  const session = await auth();
  const discussion = await caller.discussion.find.byId(discussionId);

  if (!discussion) {
    return notFound();
  }

  if (!session?.user) {
    return unauthorized();
  }

  if (discussion.user.id !== session.user.id) {
    return forbidden();
  }

  return <DiscussionEditForm discussion={discussion} />;
}
