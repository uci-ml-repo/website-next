import { UserIcon } from "lucide-react";

import type { UserSelect } from "@/db/lib/types";

export function DatasetMetadataDonor({ donor }: { donor: UserSelect }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <UserIcon className="size-5 fill-foreground" />
        <div>{donor.name}</div>
      </div>
      <div className="ml-7">
        <div className="text-sm text-muted-foreground">
          <span>Email: </span>
          {donor.email ? (
            <a href={`mailto:${donor.email}`} className="hover:underline">
              {donor.email}
            </a>
          ) : (
            <span className="text-muted-foreground">&ndash;</span>
          )}
        </div>
      </div>
    </div>
  );
}
