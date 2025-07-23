import { SidebarHoverExpandable } from "@components/layout/sidebar/sidebar-hover-expandable";
import { SidebarNav, SidebarNavLink } from "@components/layout/sidebar/sidebar-nav";
import { SidebarOpenVisible } from "@components/layout/sidebar/sidebar-open-visible";
import { SidebarTrigger } from "@components/layout/sidebar/sidebar-trigger";
import { MLRepoLogo } from "@components/logo/ml-repo";
import { Separator } from "@components/ui/separator";
import { ThemeToggle } from "@components/ui/theme-toggle";
import { ROUTES } from "@website/lib/routes";
import { cn } from "@website/lib/utils/cn";
import { DatabaseIcon, HomeIcon, LogInIcon, PlusIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import React from "react";

export function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <div className="flex items-center">
        <SidebarTrigger />
        <MLRepoLogo variant="logo-sm" abbreviate href={ROUTES.HOME} />
      </div>

      <SidebarHoverExpandable className="flex grow flex-col">
        {/* Navigation Menu */}
        <SidebarNav className="grow">
          {/* Home */}
          <SidebarNavLink href={ROUTES.HOME}>
            <HomeIcon />
            <div>Home</div>
          </SidebarNavLink>

          {/* Datasets */}
          <SidebarNavLink href={ROUTES.DATASET.ROOT} activePath={RegExp(`^${ROUTES.DATASET.BASE}`)}>
            <DatabaseIcon />
            <div>Datasets</div>
          </SidebarNavLink>

          {/*Contribute*/}
          <SidebarNavLink
            href={ROUTES.CONTRIBUTE.ROOT}
            activePath={RegExp(`^${ROUTES.CONTRIBUTE.ROOT}`)}
          >
            <PlusIcon />
            <div>Contribute</div>
          </SidebarNavLink>

          <Separator orientation="horizontal" className="mx-4 my-2 w-auto" />

          {/* Sign In */}
          <SidebarNavLink
            href={ROUTES.AUTH.SIGN_IN}
            activePath={RegExp(`^(${ROUTES.AUTH.SIGN_IN}|${ROUTES.AUTH.FORGOT_PASSWORD})`)}
          >
            <LogInIcon />
            <div>Sign In</div>
          </SidebarNavLink>

          {/* Admin */}
          {/*<SidebarMenuItem>*/}
          {/*  <SidebarMenuLink href={ROUTES.HOME} activePath={RegExp("")}>*/}
          {/*    <HomeIcon />*/}
          {/*    <div>Home</div>*/}
          {/*  </SidebarMenuLink>*/}
          {/*</SidebarMenuItem>*/}
        </SidebarNav>

        <SidebarOpenVisible className="flex items-center justify-between p-4">
          <div className="text-muted-foreground text-sm">Theme</div>
          <ThemeToggle />
        </SidebarOpenVisible>
      </SidebarHoverExpandable>
    </div>
  );
}
