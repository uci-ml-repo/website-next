import { MessageSquareTextIcon } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import { Discussions } from "@/components/discussion/Discussions";
import { Card, CardContent } from "@/components/ui/card";
import { TabHeader } from "@/components/ui/tab-header";
import { DATASETS_ROUTE } from "@/lib/routes";
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
      <div>
        {hasDiscussions ? (
          <Discussions userId={session.user.id} />
        ) : (
          <Card className="w-full bg-muted">
            <CardContent className="flex h-28 flex-col items-center justify-center space-y-1">
              <div className="text-muted-foreground">
                You have not created any discussions yet
              </div>
              <Link href={DATASETS_ROUTE} className="underline">
                Find datasets to discuss
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
