"use client";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { HOME_ROUTE } from "@/lib/routes";

export function SignOut() {
  const session = useSession();

  const handleLogout = () => {
    signOut({
      redirect: true,
      redirectTo: HOME_ROUTE,
    });

    session.update();
  };

  return (
    <DropdownMenuItem
      onClick={() => {
        handleLogout();
      }}
    >
      <LogOutIcon />
      <span>Logout</span>
    </DropdownMenuItem>
  );
}
