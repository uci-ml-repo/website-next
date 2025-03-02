import { MessageSquareTextIcon, SearchIcon } from "lucide-react";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { DiscussionMiniRow } from "@/components/discussion/preview/DiscussionMiniRow";
import {
  OverviewCard,
  OverviewCardAlternativeButton,
  OverviewCardViewMore,
} from "@/components/ui/overview-card";
import { DATASETS_ROUTE, PROFILE_DISCUSSIONS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function ProfileDiscussionsOverview() {
  const session = await auth();

  if (!session) {
    return unauthorized();
  }

  const discussionsQuery = await caller.discussion.find.byQuery({
    userId: session.user.id,
    order: { createdAt: "desc" },
    limit: 3,
  });

  const discussionsCount = discussionsQuery.count;

  return (
    <OverviewCard
      title="Discussions"
      icon={<MessageSquareTextIcon className="size-5" />}
      href={PROFILE_DISCUSSIONS_ROUTE}
    >
      {discussionsQuery.discussions.length > 0 ? (
        <>
          <div>
            {discussionsQuery.discussions.map((discussion) => (
              <DiscussionMiniRow
                key={discussion.id}
                discussion={discussion}
                className="lift"
              />
            ))}
          </div>

          <OverviewCardViewMore
            href={PROFILE_DISCUSSIONS_ROUTE}
            text={
              discussionsCount > 3
                ? `View all ${discussionsQuery.discussions.length} discussions`
                : "View all discussions"
            }
          />
        </>
      ) : (
        <OverviewCardAlternativeButton
          href={DATASETS_ROUTE}
          description="You have not posted any discussions"
          buttonText="Find datasets to discuss"
          buttonIcon={<SearchIcon />}
        />
      )}
    </OverviewCard>
  );
}
