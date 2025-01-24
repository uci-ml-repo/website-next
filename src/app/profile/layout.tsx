import path from "node:path";

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
import { PROFILE_PATH } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export const metadata: Metadata = { title: "Profile" };

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: PROFILE_PATH });
  }

  const bookmarks = await caller.bookmark.find.byUserId(session.user.id);
  const datasets = await caller.dataset.find.byUserId(session.user.id);
  const discussions = await caller.discussion.find.byUserId(session.user.id);

  return (
    <Main className="space-y-8">
      <ProfileHeader session={session} />

      <LinearTabs
        defaultValue="bookmarks"
        routerStore={PROFILE_PATH}
        routerSegment={1}
      >
        <LinearTabsList className="space-x-10 overflow-x-auto">
          <LinearTabsTrigger
            value="bookmarks"
            badgeValue={bookmarks.length}
            link={path.join(PROFILE_PATH, "bookmarks")}
          >
            Bookmarks
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="datasets"
            badgeValue={datasets.length}
            link={path.join(PROFILE_PATH, "datasets")}
          >
            Datasets
          </LinearTabsTrigger>
          <LinearTabsTrigger
            value="discussions"
            badgeValue={discussions.length}
            link={path.join(PROFILE_PATH, "discussions")}
          >
            Discussions
          </LinearTabsTrigger>
        </LinearTabsList>
        <TabsListBorder />
      </LinearTabs>

      {children}
    </Main>
  );
}
