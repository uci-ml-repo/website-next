"use client";

import { trpc } from "@/server/trpc/query/client";

export default function Test() {
  const discussions = trpc.discussion.find.bySearch.useQuery({
    search: "Phasellus",
  });

  return <div>{JSON.stringify(discussions.data)}</div>;
}
