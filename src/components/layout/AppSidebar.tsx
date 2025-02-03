"use client";

import {
  DatabaseIcon,
  HouseIcon,
  LayoutDashboardIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { useRef, useState } from "react";

import { Banner } from "@/components/icons";
import {
  Sidebar,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ADMIN_ROUTE,
  DATASETS_ROUTE,
  HOME_ROUTE,
  PROFILE_ROUTE,
} from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export default function AppSidebar({ session }: { session: Session | null }) {
  const ref = useRef<HTMLDivElement>(null);

  const [temporaryOpen, setTemporaryOpen] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(
        () => {
          setTemporaryOpen(true);
          hoverTimerRef.current = null;
        },
        temporaryOpen ? 0 : 200,
      );
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setTemporaryOpen(false);
  };

  return (
    <Sidebar ref={ref} temporaryOpen={temporaryOpen}>
      <div className="flex items-center">
        <SidebarTrigger />
        <Link href={HOME_ROUTE}>
          <Banner variant="logo-sm" className="text-nowrap" abbreviate />
        </Link>
      </div>
      <SidebarMenu
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-full"
      >
        <SidebarMenuItem>
          <Link href={HOME_ROUTE}>
            <SidebarMenuButton activePath={RegExp(`^${HOME_ROUTE}$`)}>
              <HouseIcon /> Home
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href={DATASETS_ROUTE}>
            <SidebarMenuButton activePath={DATASETS_ROUTE}>
              <DatabaseIcon /> Datasets
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        {session?.user && (
          <SidebarMenuItem>
            <Link href={PROFILE_ROUTE}>
              <SidebarMenuButton activePath={PROFILE_ROUTE}>
                <UserIcon /> Profile
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {isPriviliged(session?.user.role) && (
          <SidebarMenuItem>
            <Link href={ADMIN_ROUTE}>
              <SidebarMenuButton
                activePath={ADMIN_ROUTE}
                className="!text-destructive"
              >
                <LayoutDashboardIcon /> Admin
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
      <SidebarFooter
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={HOME_ROUTE}>
              <SidebarMenuButton activePath={RegExp(`^${HOME_ROUTE}$`)}>
                <HouseIcon /> Home
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
