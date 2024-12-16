"use client";

import { DatabaseIcon, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HOME_PATH } from "@/lib/routes";

const items = [
  {
    title: "Home",
    url: HOME_PATH,
    icon: HomeIcon,
  },
  {
    title: "Datasets",
    url: "/datasets",
    icon: DatabaseIcon,
  },
];

export function AppSidebar() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.pathname);
    }
  }, []);

  return (
    <div className={"absolute xl:static"}>
      <Sidebar collapsible={"icon"}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuButton asChild className={"w-fit"}>
                  <SidebarTrigger />
                </SidebarMenuButton>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentUrl === item.url}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {currentUrl === item.url && (
                          <span
                            className={
                              "absolute right-3 size-1.5 rounded-full bg-foreground"
                            }
                          />
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
