import { ProfileBookmarksOverview } from "@/components/profile/overview/ProfileBookmarksOverview";
import { ProfileDatasetsOverview } from "@/components/profile/overview/ProfileDatasetsOverview";
import { ProfileDiscussionsOverview } from "@/components/profile/overview/ProfileDiscussionsOverview";

export default async function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <ProfileBookmarksOverview />
      <ProfileDiscussionsOverview />
      <ProfileDatasetsOverview />
    </div>
  );
}
