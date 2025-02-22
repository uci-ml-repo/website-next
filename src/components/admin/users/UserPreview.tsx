import type { UserSelect } from "@/db/lib/types";

export function UserPreview({ user }: { user: UserSelect }) {
  return <div>{JSON.stringify(user)}</div>;
}
