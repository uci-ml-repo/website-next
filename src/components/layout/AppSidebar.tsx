"use client";

import {
  ChevronRightIcon,
  DatabaseIcon,
  HouseIcon,
  InfoIcon,
  LayoutDashboardIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";

import DatasetSidebarPreview from "@/components/dataset/preview/DatasetSidebarPreview";
import { Banner } from "@/components/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarOpenVisible,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ABOUT_ROUTE,
  ADMIN_ROUTE,
  CONTACT_ROUTE,
  CONTRIBUTE_ROUTE,
  DATASETS_ROUTE,
  HOME_ROUTE,
  PRIVACY_POLICY_ROUTE,
  PROFILE_BOOKMARKS_ROUTE,
  PROFILE_ROUTE,
} from "@/lib/routes";
import { cn } from "@/lib/utils";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { trpc } from "@/server/trpc/query/client";

export default function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const ref = useRef<HTMLDivElement>(null);

  const { setOpen, open, temporaryOpen, setTemporaryOpen } = useSidebar();
  const [resourcesOpen, setResourcesOpen] = useState(true);

  useEffect(() => {
    if (!open) setResourcesOpen(false);
  }, [open, setResourcesOpen]);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!hoverTimerRef.current) {
      hoverTimerRef.current = setTimeout(
        () => {
          setTemporaryOpen(true);
          hoverTimerRef.current = null;
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

  const resourcePath = RegExp(
    `${ABOUT_ROUTE}|${CONTACT_ROUTE}|${PRIVACY_POLICY_ROUTE}`,
  );

  useEffect(() => {
    if (temporaryOpen && pathname.match(resourcePath)) {
      setResourcesOpen(true);
    } else if (!temporaryOpen && !open) {
      setResourcesOpen(false);
    }
  }, [open, pathname, resourcePath, temporaryOpen]);

  useEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const bookmarksQuery = trpc.bookmark.find.byUserQuery.useQuery(
    {},
    { enabled: !!session?.user },
  );

  return (
    <Sidebar ref={ref} className="pb-6">
      <div className="flex items-center">
        <SidebarTrigger />
        <Link href={HOME_ROUTE}>
          <Banner variant="logo-sm" className="text-nowrap" abbreviate />
        </Link>
      </div>
      <SidebarMenu
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex-1 overflow-hidden"
      >
        <SidebarMenuItem>
          <SidebarMenuButton activePath={RegExp(`^${HOME_ROUTE}$`)} asChild>
            <Link href={HOME_ROUTE}>
              <HouseIcon />
              <span>Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton activePath={DATASETS_ROUTE} asChild>
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
        <Separator orientation="horizontal" className="mx-4 my-2 w-auto" />

        {session?.user && (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton activePath={PROFILE_ROUTE} asChild>
                <Link href={PROFILE_ROUTE}>
                  <UserIcon />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {bookmarksQuery.data &&
              bookmarksQuery.data.bookmarks.length > 0 && (
                <SidebarOpenVisible className="mt-2 flex h-full flex-col overflow-hidden">
                  <SidebarGroup className="overflow-hidden">
                    <SidebarGroupLabel asChild>
                      <Link
                        href={PROFILE_BOOKMARKS_ROUTE}
                        className="hover:underline"
                      >
                        Bookmarks
                      </Link>
                    </SidebarGroupLabel>
                    <div className="flex-1 overflow-y-auto">
                      <ul>
                        {bookmarksQuery.data.bookmarks.map(
                          (datasetBookmark) => (
                            <DatasetSidebarPreview
                              dataset={datasetBookmark.dataset}
                              key={datasetBookmark.dataset.id}
                            />
                          ),
                        )}
                      </ul>
                    </div>
                  </SidebarGroup>
                </SidebarOpenVisible>
              )}
          </>
        )}
      </SidebarMenu>
      <SidebarFooter
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarMenu>
          {isPriviliged(session?.user.role) && (
            <SidebarMenuItem>
              <SidebarMenuButton
                activePath={ADMIN_ROUTE}
                className="!text-destructive"
                asChild
              >
                <Link href={ADMIN_ROUTE}>
                  <LayoutDashboardIcon />
                  <span>Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <Collapsible
            className="group/collapsible"
            open={resourcesOpen}
            onOpenChange={(isCollapsibleOpen) => {
              if (isCollapsibleOpen) {
                setOpen(true);
                setResourcesOpen(true);
              } else {
                setResourcesOpen(false);
              }
            }}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton
                  activePath={RegExp(
                    `${ABOUT_ROUTE}|${CONTACT_ROUTE}|${PRIVACY_POLICY_ROUTE}`,
                  )}
                >
                  <InfoIcon />
                  <span className="flex w-full items-center justify-between">
                    <span>Resources</span>
                    <ChevronRightIcon
                      className={cn("transition-transform", {
                        "rotate-90": resourcesOpen,
                      })}
                    />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </CollapsibleTrigger>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: resourcesOpen ? "auto" : 0 }}
              className="overflow-hidden"
            >
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubButton asChild activePath={ABOUT_ROUTE}>
                    <Link href={ABOUT_ROUTE}>About</Link>
                  </SidebarMenuSubButton>

                  <SidebarMenuSubButton asChild activePath={CONTACT_ROUTE}>
                    <Link href={CONTACT_ROUTE}>Contact</Link>
                  </SidebarMenuSubButton>

                  <SidebarMenuSubButton
                    asChild
                    activePath={PRIVACY_POLICY_ROUTE}
                  >
                    <Link href={PRIVACY_POLICY_ROUTE}>Privacy</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSub>
              </CollapsibleContent>
            </motion.div>
          </Collapsible>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
