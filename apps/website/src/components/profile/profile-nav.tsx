import type { NavTab } from "@/components/ui/nav-tabs";
import { NavTabs } from "@/components/ui/nav-tabs";
import { ROUTES } from "@/lib/routes";

export function ProfileNav() {
  const tabs: NavTab[] = [
    {
      display: "Bookmarks",
      path: ROUTES.PROFILE.ROOT,
    },
  ];

  return <NavTabs tabs={tabs} />;
}
