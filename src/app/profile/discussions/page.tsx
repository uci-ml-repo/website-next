import { MessageSquareTextIcon } from "lucide-react";
import React from "react";

import { auth } from "@/auth";
import Discussions from "@/components/discussion/Discussions";
import { Card, CardContent } from "@/components/ui/card";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();

  const hasDiscussions =
    (
      await caller.discussion.find.byQuery({
        userId: session!.user.id,
        limit: 1,
      })
    ).discussions.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageSquareTextIcon className="size-6" />
        <h2 className="text-2xl font-bold">Discussions</h2>
      </div>
      <div>
        {hasDiscussions ? (
          <Discussions userId={session!.user.id} />
        ) : (
          <Card className="w-full bg-muted">
            <CardContent className="flex h-[130px] items-center justify-center">
              <div className="space-y-3 text-center text-muted-foreground">
                You have no discussions yet
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
