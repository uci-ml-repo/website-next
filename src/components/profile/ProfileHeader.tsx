import type { Session } from "next-auth";

import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import type { UserRole } from "@/db/lib/enums";

export function ProfileHeader({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex min-w-0 items-center space-x-4">
        <ProfileAvatar
          src={session.user.image}
          className="size-16 sm:size-20"
        />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold sm:text-3xl">
            {session.user.name}
          </h1>
          <div className="text-base text-muted-foreground sm:text-xl">
            {session.user.email}
          </div>
        </div>
      </div>
      <ProfileHeaderRoleBadge role={session.user.role} />
    </div>
  );
}

function ProfileHeaderRoleBadge({ role }: { role: UserRole }) {
  if (!role || role === "basic") {
    return <div />;
  }

  return (
    <Badge
      variant={role === "admin" ? "destructive" : "blue"}
      size="lg"
      className="z-50"
    >
      {role.toUpperCase()}
    </Badge>
  );
}
