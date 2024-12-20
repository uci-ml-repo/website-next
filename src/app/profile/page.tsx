import type { UserRole } from "@prisma/client";
import { CircleUserRoundIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import Main from "@/components/layout/Main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PROFILE_PATH } from "@/lib/routes";

export const metadata: Metadata = { title: "Profile" };

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: PROFILE_PATH });
  }

  return (
    <Main>
      <div className={"flex items-center justify-between"}>
        <div className={"flex items-center space-x-4"}>
          <Avatar className={"size-20"}>
            {session.user.image && <AvatarImage src={session.user.image} />}
            <AvatarFallback>
              <CircleUserRoundIcon
                className={"size-4/5 text-muted-foreground"}
              />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className={"text-3xl font-semibold"}>{session.user.name}</div>
            <div className={"text-xl text-muted-foreground"}>
              {session.user.email}
            </div>
          </div>
        </div>
        <RoleBadge role={session.user.role} />
      </div>
    </Main>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "BASIC") {
    return <div></div>;
  }

  return (
    <Badge variant={role === "ADMIN" ? "destructive" : "blue"} size={"lg"}>
      {role}
    </Badge>
  );
}
