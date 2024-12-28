import DatasetDiscussionPostUpvotes from "@/components/dataset/page/tabs/discussion/post/upvote/DatasetDiscussionPostUpvotes";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvatar from "@/components/ui/profile-avatar";
import type { DatasetDiscussionResponse } from "@/lib/types";

export default function DatasetDiscussionPost({
  discussion,
}: {
  discussion: DatasetDiscussionResponse;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <ProfileAvatar src={discussion.user.image} className="size-8" />
            <span className="font-semibold">{discussion.user.name}</span>
          </div>
          <DatasetDiscussionPostUpvotes discussion={discussion} />
        </div>

        <p>{discussion.text}</p>
      </CardContent>
    </Card>
  );
}
