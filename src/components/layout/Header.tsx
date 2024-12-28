import { UserRole } from "@prisma/client";
import { LayoutDashboardIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import SignInButton from "@/components/auth/SignInButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileAvatar from "@/components/ui/profile-avatar";
import { ADMIN_PATH, HOME_PATH, PROFILE_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default async function Header() {
  const session = await auth();

  return (
    <header className="relative">
      <div className="flex h-20 items-center justify-between p-4 sm:px-6">
        <div />
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
                <Link href={PROFILE_PATH}>
                  <UserIcon />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {session.user.role === UserRole.ADMIN && (
                <DropdownMenuItem destructive asChild>
                  <Link href={ADMIN_PATH}>
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={async () => {
                  "use server";
                  await signOut({
                    redirect: true,
                    redirectTo: HOME_PATH,
                  });
                }}
              >
                <LogOutIcon />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}
