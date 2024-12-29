import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import Main from "@/components/layout/Main";
import ProfileBookmarks from "@/components/profile/ProfileBookmarks";
import ProfileHeader from "@/components/profile/ProfileHeader";
import {
  LinearTabs,
  LinearTabsContent,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import { PROFILE_PATH } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export const metadata: Metadata = { title: "Profile" };

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: PROFILE_PATH });
  }

  const bookmarks = await caller.datasets.bookmarks.byUserId(session.user.id);
  const datasets = await caller.datasets.find.byUserId(session.user.id);

  return (
    <Main className="space-y-8">
      <ProfileHeader session={session} />

      <LinearTabs defaultValue="bookmarks">
        <LinearTabsList className="space-x-10 overflow-x-auto">
          <LinearTabsTrigger value="bookmarks" badgeValue={bookmarks.length}>
            Bookmarks
          </LinearTabsTrigger>
          <LinearTabsTrigger value="datasets" badgeValue={datasets.length}>
            Datasets
          </LinearTabsTrigger>
        </LinearTabsList>
        <TabsListBorder />

        <LinearTabsContent value="bookmarks">
          <ProfileBookmarks bookmarks={bookmarks} />
        </LinearTabsContent>
        <LinearTabsContent value="datasets">DATASETS</LinearTabsContent>
      </LinearTabs>
    </Main>
  );
}
