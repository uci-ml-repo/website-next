"use client";

import { trpc } from "@/server/trpc/query/client";

export default function Test() {
  const discussions = trpc.discussion.find.byQuery.useQuery({
    order: { upvoteCount: "desc", createdAt: "desc" },
    datasetId: 53,
    limit: 10,
    userId: undefined,
  });

  return <div>{JSON.stringify(discussions.data)}</div>;
}
