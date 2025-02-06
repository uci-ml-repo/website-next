import path from "node:path";

import { SettingsIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import Main from "@/components/layout/Main";
import ProfileHeader from "@/components/profile/ProfileHeader";
import {
  LinearTabs,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import { PROFILE_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export const metadata: Metadata = { title: "Profile" };

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: PROFILE_ROUTE });
  }

  const bookmarks = (await caller.bookmark.find.byUserQuery({})).bookmarks;
  const datasets = await caller.dataset.find.byUserId(session.user.id);
  const discussions = await caller.discussion.find.byUserId(session.user.id);

  return (
    <Main className="space-y-8">
      <ProfileHeader session={session} />

      <LinearTabs
        defaultValue="bookmarks"
        routerStore={PROFILE_ROUTE}
        routerSegment={1}
      >
        <LinearTabsList className="space-x-10 overflow-x-auto">
          <LinearTabsTrigger
            value="bookmarks"
            badgeValue={bookmarks.length}
            link={path.join(PROFILE_ROUTE, "bookmarks")}
          >
            Bookmarks
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="datasets"
            badgeValue={datasets.length}
            link={path.join(PROFILE_ROUTE, "datasets")}
          >
            Datasets
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="discussions"
            badgeValue={discussions.length}
            link={path.join(PROFILE_ROUTE, "discussions")}
          >
            Discussions
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="settings"
            link={path.join(PROFILE_ROUTE, "settings")}
            className="group"
            aria-label="Profile settings"
          >
            <SettingsIcon className="transition-all group-hover:rotate-[30deg]" />
          </LinearTabsTrigger>
        </LinearTabsList>
        <TabsListBorder />
      </LinearTabs>

      {children}
    </Main>
  );
}
