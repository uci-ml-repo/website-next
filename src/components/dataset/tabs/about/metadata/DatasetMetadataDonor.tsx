import type { UserSelect } from "@/db/lib/types";

export function DatasetMetadataDonor({ donor }: { donor: UserSelect }) {
  return <div>{JSON.stringify(donor)}</div>;
}
