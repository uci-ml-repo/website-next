import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { ProfileSettingsDelete } from "@/components/profile/settings/ProfileSettingsDelete";
import { ProfileSettingsEmail } from "@/components/profile/settings/ProfileSettingsEmail";
import { TabHeader } from "@/components/ui/tab-header";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  return (
    <div className="space-y-8">
      <TabHeader title="Profile Settings" />
      <div className="space-y-6">
        <ProfileSettingsEmail initialSession={session} />
        <hr />
        <ProfileSettingsDelete session={session} />
      </div>
    </div>
  );
}
