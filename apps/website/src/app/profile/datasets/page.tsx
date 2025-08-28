import { auth } from "@packages/auth/auth";
import { headers } from "next/headers";

import { ProfileDatasets } from "@/components/profile/datasets/profile-datasets";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error();

  return <ProfileDatasets session={session} />;
}
