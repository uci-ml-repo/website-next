import { auth } from "@/auth";
import ProfileDatasets from "@/components/profile/ProfileDatasets";
import { caller } from "@/server/trpc/query/server";

export default async function Page() {
  const session = await auth();
  const datasets = await caller.dataset.find.byUserId(session!.user.id);

  return <ProfileDatasets datasets={datasets} />;
}
