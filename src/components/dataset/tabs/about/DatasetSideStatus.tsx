import { DatasetStatusBadge } from "@/components/dataset/DatasetStatusBadge";
import type { Enums } from "@/db/lib/enums";

export function DatasetSideStatus({
  status,
}: {
  status: Enums.ApprovalStatus;
}) {
  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">Status</div>
      <DatasetStatusBadge status={status} />
    </div>
  );
}
