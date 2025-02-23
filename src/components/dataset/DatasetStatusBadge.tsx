import type { BadgeSize, BadgeVariant } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Enums } from "@/db/lib/enums";

export function DatasetStatusBadge({
  status,
  size,
}: {
  status: string;
  size?: BadgeSize;
}) {
  let variant: BadgeVariant;

  switch (status) {
    case Enums.ApprovalStatus.APPROVED:
      variant = "positive";
      break;
    case Enums.ApprovalStatus.PENDING:
      variant = "gold";
      break;
    case Enums.ApprovalStatus.DRAFT:
      variant = "secondary";
      break;
    case Enums.ApprovalStatus.REJECTED:
      variant = "destructive";
      break;
  }

  return (
    <Badge variant={variant} size={size}>
      {status.toUpperCase()}
    </Badge>
  );
}
