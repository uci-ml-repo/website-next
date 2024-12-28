import AddDatasetDiscussion from "@/components/dataset/page/tabs/discussion/add/AddDatasetDiscussion";
import DatasetDiscussionPost from "@/components/dataset/page/tabs/discussion/post/DatasetDiscussionPost";
import type { DatasetResponse } from "@/lib/types";
import { caller } from "@/server/trpc/query/server";

export default async function DatasetDiscussion({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const discussions = await caller.discussions.find.byQuery({
    datasetId: dataset.id,
    take: 10,
    orderBy: "upvoteCount",
    sort: "desc",
  });

  return (
    <div className="space-y-8">
      <AddDatasetDiscussion dataset={dataset} discussions={discussions} />
      {discussions.map((discussion, index) => (
        <DatasetDiscussionPost key={index} discussion={discussion} />
      ))}
    </div>
  );
}
