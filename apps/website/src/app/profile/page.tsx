import { auth } from "@packages/auth";
import { headers } from "next/headers";

import { ProfileBookmarks } from "@/components/profile/bookmarks/profile-bookmarks";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error();

  return <ProfileBookmarks session={session} />;
}
