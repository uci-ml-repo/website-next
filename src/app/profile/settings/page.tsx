import { SettingsIcon } from "lucide-react";
import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { ProfileSettingsDelete } from "@/components/profile/settings/ProfileSettingsDelete";
import { ProfileSettingsEmail } from "@/components/profile/settings/ProfileSettingsEmail";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="size-6 sm:size-7" />
        <h2 className="text-2xl font-bold">Profile Settings</h2>
      </div>

      <div className="space-y-6">
        <ProfileSettingsEmail />
        <hr />
        <ProfileSettingsDelete />
      </div>
    </div>
  );
}
