import { LayoutDashboardIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOut from "@/components/auth/SignOut";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileAvatar from "@/components/ui/profile-avatar";
import { Enums } from "@/db/enums";
import { ADMIN_ROUTE, PROFILE_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default async function Header() {
  const session = await auth();

  return (
    <header className="relative">
      <div className="flex h-20 items-center justify-between p-4 sm:px-6">
        <div />
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ProfileAvatar
                src={session.user.image}
                role="button"
                className={cn(
                  "cursor-pointer outline outline-4 outline-border",
                  "transition-all duration-100 ease-out hover:scale-105",
                )}
              />
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
                    <span>Dashboard</span>
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
    </header>
  );
}
