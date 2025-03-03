import { MessageSquareTextIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import { Discussions } from "@/components/discussion/Discussions";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
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
          <AlternativeCard>
            <div className="text-muted-foreground">
              You have not created any discussions yet.
            </div>
            <Button variant="gold" asChild className="lift">
              <Link href={DATASETS_ROUTE}>
                <SearchIcon /> Find datasets to discuss
              </Link>
            </Button>
          </AlternativeCard>
        )}
      </div>
    </div>
  );
}
