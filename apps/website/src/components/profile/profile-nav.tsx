import { SettingsIcon } from "lucide-react";

import type { NavTab } from "@/components/ui/nav-tabs";
import { NavTabs } from "@/components/ui/nav-tabs";
import { ROUTES } from "@/lib/routes";

export function ProfileNav() {
  const tabs: NavTab[] = [
    {
      display: "Bookmarks",
      path: ROUTES.PROFILE.ROOT,
    },
    {
      display: "Datasets",
      path: ROUTES.PROFILE.DATASETS,
    },
    {
      display: <SettingsIcon className="size-5.5" aria-label="Dataset settings" />,
      path: ROUTES.PROFILE.SETTINGS,
    },
  ];

  return <NavTabs tabs={tabs} />;
}
