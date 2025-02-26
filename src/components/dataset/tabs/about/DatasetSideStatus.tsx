import { CircleHelpIcon } from "lucide-react";
import React from "react";

import { DatasetStatusBadge } from "@/components/dataset/DatasetStatusBadge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Enums } from "@/db/lib/enums";

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
        "This dataset is a draft. You can freely edit it before submitting for approval.",
    },
    {
      value: Enums.ApprovalStatus.PENDING,
      label: "Pending",
      tooltip: "This dataset is pending approval. We will review it soon.",
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
              className="size-[18px] cursor-help text-muted-foreground max-sm:hidden"
              tabIndex={0}
            />
          </HoverCardTrigger>
          <HoverCardContent side="left" align="start" className="w-80 !p-0">
            <div className="p-2 text-muted-foreground">
              Only visible to you.
            </div>
            <ul>
              {statusOptions.map((option) => (
                <React.Fragment key={option.value}>
                  <hr />

                  <li className="space-y-1 p-2">
                    <DatasetStatusBadge status={option.value} />
                    <div className="text-sm text-muted-foreground">
                      {option.tooltip}
                    </div>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </HoverCardContent>
        </HoverCard>
      </div>
      <DatasetStatusBadge status={status} />
    </div>
  );
}
