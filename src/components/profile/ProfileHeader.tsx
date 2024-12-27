import type { UserRole } from "@prisma/client";
import { CircleUserRoundIcon } from "lucide-react";
import type { Session } from "next-auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeader({ session }: { session: Session }) {
  return (
    <div className={"flex items-center justify-between"}>
      <div className={"flex items-center space-x-4"}>
        <Avatar className={"size-16 sm:size-20"}>
          {session.user.image && <AvatarImage src={session.user.image} />}
          <AvatarFallback>
            <CircleUserRoundIcon className={"size-4/5 text-muted-foreground"} />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className={"text-xl font-semibold sm:text-3xl"}>
            {session.user.name}
          </div>
          <div className={"text-base text-muted-foreground sm:text-xl"}>
            {session.user.email}
          </div>
        </div>
      </div>
      <RoleBadge role={session.user.role} />
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "BASIC") {
    return <div />;
  }

  return (
    <Badge variant={role === "ADMIN" ? "destructive" : "blue"} size={"lg"}>
      {role}
    </Badge>
  );
}
