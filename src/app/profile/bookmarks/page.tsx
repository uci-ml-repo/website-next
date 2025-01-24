import { auth } from "@/auth";
import ProfileBookmarks from "@/components/profile/ProfileBookmarks";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();
  const bookmarks = await caller.bookmark.find.byUserId(session!.user.id);

  return <ProfileBookmarks bookmarks={bookmarks} />;
}
