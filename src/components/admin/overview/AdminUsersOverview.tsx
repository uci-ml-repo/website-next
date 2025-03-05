import { TrendingUpIcon, UserIcon } from "lucide-react";

import {
  OverviewCard,
  OverviewCardViewMore,
} from "@/components/ui/overview-card";
import { ADMIN_USERS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function AdminUsersOverview() {
  const usersCount = await caller.user.find.countByQuery({});
  const newWeeklyUsersCount = await caller.user.find.countByQuery({
    createdAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  });

  return (
    <OverviewCard
      title="Users"
      icon={<UserIcon className="size-5" />}
      href={ADMIN_USERS_ROUTE}
    >
      <div className="flex h-full w-full items-center justify-around">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 text-2xl font-bold">
            <UserIcon className="size-5" />
            <span>{usersCount.toLocaleString()}</span>
          </div>
          <div className="text-muted-foreground">Users</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 text-2xl font-bold">
            <TrendingUpIcon className="size-5" />
            <span>{newWeeklyUsersCount.toLocaleString()}</span>
          </div>
          <div className="text-muted-foreground">Weekly new users</div>
        </div>
      </div>
      <OverviewCardViewMore
        href={ADMIN_USERS_ROUTE}
        text={`View all ${usersCount.toLocaleString()} users`}
      />
    </OverviewCard>
  );
}
