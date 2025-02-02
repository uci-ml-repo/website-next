import { DatabaseIcon, Home } from "lucide-react";

import { Sidebar } from "@/components/ui/sidebar.new";
import { DATASETS_ROUTE, HOME_ROUTE } from "@/lib/routes";

const items = [
  {
    title: "Home",
    url: HOME_ROUTE,
    icon: Home,
  },
  {
    title: "Datasets",
    url: DATASETS_ROUTE,
    icon: DatabaseIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <div>X</div>
    </Sidebar>
  );
}
