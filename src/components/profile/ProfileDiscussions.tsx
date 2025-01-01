import type { DiscussionResponse } from "@/lib/types";

export default function ProfileDiscussions({
  discussions,
}: {
  discussions: DiscussionResponse[];
}) {
  return <div className="space-y-8" />;
}
