import {
  DatabaseIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogInIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import type { HTMLAttributes, RefObject } from "react";

import { useSessionWithInitial } from "@/components/hooks/use-session-with-initial";
import { SidebarHoverExpandable } from "@/components/layout/sidebar/sidebar-hover-expandable";
import { SidebarNav, SidebarNavLink } from "@/components/layout/sidebar/sidebar-nav";
import { SidebarOpenVisible } from "@/components/layout/sidebar/sidebar-open-visible";
import { useSidebar } from "@/components/layout/sidebar/sidebar-provider";
import { SidebarTrigger } from "@/components/layout/sidebar/sidebar-trigger";
import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Session } from "@/lib/auth/auth";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/util/cn";
import { isPriviliged } from "@/server/trpc/middleware/util/role";

interface Props extends HTMLAttributes<HTMLDivElement> {
  initialSession: Session | null;
  ref?: RefObject<HTMLDivElement>;
}

export function SidebarContent({ className, initialSession, ...props }: Props) {
  const { currentState } = useSidebar();

  const session = useSessionWithInitial(initialSession);

  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <div className="flex items-center">
        <SidebarTrigger />
        <MLRepoLogo
          variant="logo-sm"
          abbreviate
          href={currentState !== "collapsed" ? ROUTES.HOME : undefined}
        />
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
          <SidebarNavLink href={ROUTES.SEARCH} activePath={RegExp(`^${ROUTES.DATASET.ROOT}`)}>
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

          {session ? (
            <>
              {/* Profile */}
              <SidebarNavLink
                href={ROUTES.PROFILE.ROOT}
                activePath={RegExp(`^${ROUTES.PROFILE.ROOT}`)}
              >
                <UserIcon />
                <div>Profile</div>
              </SidebarNavLink>

              {/* Admin */}
              {isPriviliged(session.user.role) && (
                <SidebarNavLink
                  href={ROUTES.ADMIN.ROOT}
                  activePath={RegExp(`^${ROUTES.ADMIN.ROOT}`)}
                  className="text-destructive"
                >
                  <LayoutDashboardIcon />
                  <div>Admin</div>
                </SidebarNavLink>
              )}
            </>
          ) : (
            // Sign In
            <SidebarNavLink
              href={ROUTES.AUTH.SIGN_IN}
              activePath={RegExp(
                `^(${ROUTES.AUTH.SIGN_IN}|${ROUTES.AUTH.FORGOT_PASSWORD}|${ROUTES.AUTH.VERIFY})`,
              )}
            >
              <LogInIcon />
              <div>Sign In</div>
            </SidebarNavLink>
          )}
        </SidebarNav>

        <SidebarOpenVisible className="flex items-center justify-between p-4">
          <div className="text-muted-foreground text-sm">Theme</div>
          <ThemeToggle />
        </SidebarOpenVisible>
      </SidebarHoverExpandable>
    </div>
  );
}
