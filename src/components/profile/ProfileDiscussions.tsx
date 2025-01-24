import DiscussionPreview from "@/components/dataset/tabs/discussions/view/DiscussionPreview";
import type { DiscussionResponse } from "@/lib/types";

export default function ProfileDiscussions({
  discussions,
}: {
  discussions: DiscussionResponse[];
}) {
  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <DiscussionPreview key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
}
