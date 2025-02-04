import { MessageSquareTextIcon } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import Discussions from "@/components/discussion/Discussions";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="flex items-center space-x-2">
        <MessageSquareTextIcon className="size-6 sm:size-7" />
        <h2 className="text-2xl font-bold">Discussions</h2>
      </div>
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
                Find a dataset to discuss
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
