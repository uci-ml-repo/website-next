"use client";

import type { Session } from "@packages/auth/auth";
import { authClient } from "@packages/auth/auth-client";
import { SignOutIcon } from "@primer/octicons-react";
import { CircleUserRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export function ProfileHeader({ session }: { session: Session }) {
  const router = useRouter();

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
    <div className="flex justify-between">
      <div className="flex items-center gap-x-4">
        <Avatar className="size-20">
          {session.user.image && <AvatarImage src={session.user.image} />}
          <AvatarFallback>
            <CircleUserRoundIcon className="text-muted-foreground size-4/5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-2xl font-semibold md:text-3xl">{session.user.name}</div>
          <div className="text-muted-foreground text-base md:text-lg">{session.user.email}</div>
        </div>
      </div>
      <Button variant="ghost" className="text-muted-foreground max-md:hidden" onClick={signOut}>
        <SignOutIcon /> Sign Out
      </Button>
    </div>
  );
}
