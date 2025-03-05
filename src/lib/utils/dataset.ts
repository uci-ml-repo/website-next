import { Enums } from "@/db/lib/enums";

export function isDraftOrPending({ status }: { status: Enums.ApprovalStatus }) {
  return (
    status === Enums.ApprovalStatus.DRAFT ||
    status === Enums.ApprovalStatus.PENDING
  );
}
