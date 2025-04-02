import { forbidden, notFound, unauthorized } from "next/navigation";

import { getDataset } from "@/app/dataset/[id]/[slug]/get-dataset";
import { auth } from "@/auth";
import { TabHeader } from "@/components/ui/tab-header";
import { Enums } from "@/db/lib/enums";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const { id } = await params;
  const dataset = await getDataset(Number(id));

  if (!dataset || dataset.status === Enums.ApprovalStatus.DRAFT) {
    return notFound();
  }

  if (
    !isPriviliged(session?.user.role) &&
    dataset.userId !== session?.user.id
  ) {
    return forbidden();
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <TabHeader title="Changelog" />
        <div className="text-muted-foreground">(Only visible to you)</div>
      </div>
    </div>
  );
}
