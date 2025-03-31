import path from "node:path";

import { SettingsIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import { Main } from "@/components/layout/Main";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  LinearTabs,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import { Enums } from "@/db/lib/enums";
import { PROFILE_ROUTE } from "@/lib/routes";
import { enumToArray } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile and work.",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: PROFILE_ROUTE });
  }

  const bookmarks = await caller.bookmark.find.byUserQuery({});

  const datasets = await caller.dataset.find.privilegedByQuery({
    userId: session.user.id,
    status: enumToArray(Enums.ApprovalStatus),
  });

  const discussions = await caller.discussion.find.byQuery({
    userId: session.user.id,
  });

  return (
    <Main className="space-y-8">
      <ProfileHeader session={session} />

      <LinearTabs defaultValue="overview" routerStore={PROFILE_ROUTE} routerSegment={1}>
        <LinearTabsList>
          <LinearTabsTrigger value="overview" link={path.join(PROFILE_ROUTE, "overview")}>
            Overview
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="bookmarks"
            badgeValue={bookmarks.count}
            link={path.join(PROFILE_ROUTE, "bookmarks")}
          >
            Bookmarks
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="discussions"
            badgeValue={discussions.count}
            link={path.join(PROFILE_ROUTE, "discussions")}
          >
            Discussions
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="datasets"
            badgeValue={datasets.count}
            link={path.join(PROFILE_ROUTE, "datasets")}
          >
            Datasets
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="settings"
            link={path.join(PROFILE_ROUTE, "settings")}
            aria-label="Profile settings"
          >
            <SettingsIcon />
          </LinearTabsTrigger>
        </LinearTabsList>
        <TabsListBorder />
      </LinearTabs>

      {children}
    </Main>
  );
}
