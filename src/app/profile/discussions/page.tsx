import { MessageSquareTextIcon } from "lucide-react";
import { unauthorized } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import { Discussions } from "@/components/discussion/Discussions";
import { TabHeader } from "@/components/ui/tab-header";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const hasDiscussions =
    (
      await caller.discussion.find.byQuery({
        userId: session.user.id,
        limit: 1,
      })
    ).discussions.length > 0;

  return (
    <div className="space-y-4">
      <TabHeader title="Discussions" icon={MessageSquareTextIcon} />
      <Discussions userId={session.user.id} initialHasDiscussions={hasDiscussions} />
    </div>
  );
}
