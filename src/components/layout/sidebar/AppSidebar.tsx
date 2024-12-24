import { DatabaseIcon, Home } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/layout/sidebar/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DATASETS_PATH, HOME_PATH } from "@/lib/routes";

const items = [
  {
    title: "Home",
    url: HOME_PATH,
    icon: Home,
  },
  {
    title: "Datasets",
    url: DATASETS_PATH,
    icon: DatabaseIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible={"icon"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarTrigger />
              </SidebarMenuItem>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
