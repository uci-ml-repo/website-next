"use client";

import { useHasScrolledX } from "@components/hooks/use-has-scrolled";
import { useSessionWithInitial } from "@components/hooks/use-session-with-initial";
import { SidebarTrigger } from "@components/layout/sidebar/sidebar-trigger";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import type { Session } from "@lib/auth";
import { authClient } from "@lib/auth-client";
import { ROUTES } from "@lib/routes";
import { cn } from "@lib/utils/cn";
import { CircleUserRoundIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export function Header({ initialSession }: { initialSession: Session | null }) {
  const router = useRouter();
  const hasScrolled = useHasScrolledX();

  const session = useSessionWithInitial(initialSession);

  function signOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push(ROUTES.HOME);
        },
      },
    });
  }

  return (
    <header
      className={cn(
        "z-50 h-(--header-height) overflow-y-hidden transition-shadow",
        "max-md:bg-background max-md:fixed max-md:top-0 max-md:right-0 max-md:left-0",
        { "max-md:shadow-md": hasScrolled },
      )}
    >
      <div className="flex items-center justify-between">
        <SidebarTrigger className="transition-none md:invisible" />

        {session && (
          <div className="mx-4 md:my-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "cursor-pointer rounded-full outline-4",
                  "outline-background focus-visible:outline-foreground",
                )}
                aria-label="Expand profile options"
              >
                <Avatar className="size-11">
                  {session.user.image && <AvatarImage src={session.user.image} />}
                  <AvatarFallback>
                    <CircleUserRoundIcon className="text-muted-foreground size-4/5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PROFILE.ROOT}>
                    <UserIcon />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
