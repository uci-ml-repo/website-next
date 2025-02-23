import { DatasetStatusBadge } from "@/components/dataset/DatasetStatusBadge";
import type { Enums } from "@/db/lib/enums";

export function DatasetSideStatus({
  status,
}: {
  status: Enums.ApprovalStatus;
}) {
  return (
    <div className="space-y-2">
      <div>
        <span className="text-lg font-bold">Status</span>{" "}
        <span className="text-sm text-muted-foreground">(Admin)</span>
      </div>
      <DatasetStatusBadge status={status} />
    </div>
  );
}
