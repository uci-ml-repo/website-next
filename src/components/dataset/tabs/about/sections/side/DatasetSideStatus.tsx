import { CircleHelpIcon } from "lucide-react";
import React from "react";

import { DatasetStatusBadge } from "@/components/dataset/DatasetStatusBadge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Enums } from "@/db/lib/enums";
import { cn } from "@/lib/utils";

export function DatasetSideStatus({
  status,
}: {
  status: Enums.ApprovalStatus;
}) {
  const statusOptions = [
    {
      value: Enums.ApprovalStatus.DRAFT,
      label: "Draft",
      tooltip:
        "This dataset is a draft. You can freely edit it before submitting it for approval.",
    },
    {
      value: Enums.ApprovalStatus.PENDING,
      label: "Pending",
      tooltip:
        "This dataset is pending approval. We are in the process of reviewing it.",
    },
    {
      value: Enums.ApprovalStatus.APPROVED,
      label: "Approved",
      tooltip: "This dataset is approved and publicly available.",
    },
    {
      value: Enums.ApprovalStatus.REJECTED,
      label: "Rejected",
      tooltip: "This dataset was not approved.",
    },
  ];

  return (
    <div>
      <div className="flex items-center space-x-1">
        <div className="text-lg font-bold">Status</div>
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <CircleHelpIcon
              className="size-[18px] cursor-help text-muted-foreground"
              tabIndex={0}
            />
          </HoverCardTrigger>
          <HoverCardContent className="w-80 max-w-[100dvw] !p-0">
            <div className="p-2 text-muted-foreground">
              Only visible to you.
            </div>
            <hr />
            <ul className="divide-y">
              {statusOptions.map((option) => (
                <li
                  key={option.value}
                  className={cn("space-y-1 p-2", {
                    "bg-muted": status === option.value,
                  })}
                >
                  <DatasetStatusBadge status={option.value} />
                  <div className="text-sm text-muted-foreground">
                    {option.tooltip}
                  </div>
                </li>
              ))}
            </ul>
          </HoverCardContent>
        </HoverCard>
      </div>
      <DatasetStatusBadge status={status} />
    </div>
  );
}
