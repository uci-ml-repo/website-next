import { notFound } from "next/navigation";

import MDXViewer from "@/components/editor/MDXViewer";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string; discussionId: string }>;
}) {
  const discussion = await caller.discussions.find.byId(
    (await params).discussionId,
  );

  if (!discussion) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{discussion.title}</h1>
      <MDXViewer markdown={discussion.content} />
    </div>
  );
}
