"use client";

import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";

import { SignInButton } from "@/components/auth/SignInButton";
import { SignOut } from "@/components/auth/SignOut";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { BackgroundGraph } from "@/components/layout/graph/BackgroundGraph";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Enums } from "@/db/lib/enums";
import { ADMIN_ROUTE, PROFILE_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Header({ session }: { session: Session | null }) {
  const isMobile = useIsMobile();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "z-50 h-[--header-height] max-md:fixed max-md:left-0 max-md:right-0 max-md:top-0",
        "transition-shadow ease-in-out max-md:overflow-y-hidden md:!h-14",
        { "bg-background shadow-md": isMobile && hasScrolled },
      )}
    >
      <BackgroundGraph className="max absolute right-0 top-0 -z-10 md:hidden" />

      <div className="flex items-center justify-between">
        <div>
          <SidebarTrigger className="md:hidden" />
        </div>
        <div className="mx-4 md:my-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Profile options">
                  <ProfileAvatar src={session.user.image} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44" align="end">
                <DropdownMenuItem asChild>
                  <Link href={PROFILE_ROUTE}>
                    <UserIcon />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {session.user.role === Enums.UserRole.ADMIN && (
                  <DropdownMenuItem destructive asChild>
                    <Link href={ADMIN_ROUTE}>
                      <LayoutDashboardIcon />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <SignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  );
}
