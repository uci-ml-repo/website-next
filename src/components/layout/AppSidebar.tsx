"use client";

import {
  DatabaseIcon,
  HouseIcon,
  LayoutDashboardIcon,
  LogInIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { useEffect, useRef } from "react";

import { Banner } from "@/components/icons";
import { SidebarBookmarks } from "@/components/layout/sidebar/SidebarBookmarks";
import { ThemeToggle } from "@/components/layout/sidebar/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarOpenVisible,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ADMIN_ROUTE,
  CONTRIBUTE_ROUTE,
  DATASET_BASE_ROUTE,
  DATASETS_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  HOME_ROUTE,
  PROFILE_ROUTE,
  SIGN_IN_ROUTE,
} from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const ref = useRef<HTMLDivElement>(null);

  const { temporaryOpen, setTemporaryOpen, open } = useSidebar();

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(
        () => {
          if (!open) {
            setTemporaryOpen(true);
            hoverTimerRef.current = null;
          }
        },
        temporaryOpen ? 0 : 150,
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

  useEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <Sidebar ref={ref} className="flex flex-col overflow-y-hidden">
      <div className="flex items-center">
        <SidebarTrigger />
        <SidebarOpenVisible>
          <Link href={HOME_ROUTE}>
            <Banner variant="logo-sm" className="text-nowrap" abbreviate />
          </Link>
        </SidebarOpenVisible>
      </div>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex h-full flex-col overflow-hidden"
      >
        <SidebarMenu className="shrink-0">
          <SidebarMenuItem>
            <SidebarMenuButton activePath={RegExp(`^${HOME_ROUTE}$`)} asChild>
              <Link href={HOME_ROUTE}>
                <HouseIcon />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton activePath={RegExp(`^${DATASET_BASE_ROUTE}`)} asChild>
              <Link href={DATASETS_ROUTE}>
                <DatabaseIcon />
                <span>Datasets</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton activePath={CONTRIBUTE_ROUTE} asChild>
              <Link href={CONTRIBUTE_ROUTE}>
                <PlusIcon />
                <span>Contribute</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Separator orientation="horizontal" className="mx-4 my-2 w-auto" aria-hidden={true} />

          {session?.user ? (
            <SidebarMenuItem>
              <SidebarMenuButton activePath={PROFILE_ROUTE} asChild>
                <Link href={PROFILE_ROUTE}>
                  <UserIcon />
                  <span>Profile & Work</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                activePath={RegExp(`^${SIGN_IN_ROUTE}|^${FORGOT_PASSWORD_ROUTE}`)}
                asChild
              >
                <Link href={SIGN_IN_ROUTE}>
                  <LogInIcon />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {isPriviliged(session?.user.role) && (
            <SidebarMenuItem>
              <SidebarMenuButton
                activePath={ADMIN_ROUTE}
                className="!text-destructive-muted"
                asChild
              >
                <Link href={ADMIN_ROUTE}>
                  <LayoutDashboardIcon />
                  <span>Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <SidebarBookmarks session={session} />

        <SidebarFooter>
          <SidebarOpenVisible className="flex items-center justify-between p-4 pb-6">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </SidebarOpenVisible>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
