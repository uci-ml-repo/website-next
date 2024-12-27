import type { DatasetDiscussionResponse } from "@/lib/types";

export default function DatasetDiscussionPost({
  discussion,
}: {
  discussion: DatasetDiscussionResponse;
}) {
  return <div>{discussion.text}</div>;
}
