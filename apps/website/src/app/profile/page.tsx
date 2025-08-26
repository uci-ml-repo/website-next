import { auth } from "@packages/auth/auth";
import { CircleUserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN());
  }

  return (
    <div className="flex items-center gap-x-4">
      <Avatar className="size-24">
        {session.user.image && <AvatarImage src={session.user.image} />}
        <AvatarFallback>
          <CircleUserRoundIcon className="text-muted-foreground size-4/5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="text-3xl font-semibold">{session.user.name}</div>
        <div className="text-muted-foreground text-lg">{session.user.email}</div>
      </div>
    </div>
  );
}
