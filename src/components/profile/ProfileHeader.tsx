import type { UserRole } from "@prisma/client";
import type { Session } from "next-auth";

import { Badge } from "@/components/ui/badge";
import ProfileAvatar from "@/components/ui/profile-avatar";

export default function ProfileHeader({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <ProfileAvatar
          src={session.user.image}
          className="size-16 sm:size-20"
        />
        <div>
          <div className="text-xl font-semibold sm:text-3xl">
            {session.user.name}
          </div>
          <div className="text-base text-muted-foreground sm:text-xl">
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
    <Badge variant={role === "ADMIN" ? "destructive" : "blue"} size="lg">
      {role}
    </Badge>
  );
}
