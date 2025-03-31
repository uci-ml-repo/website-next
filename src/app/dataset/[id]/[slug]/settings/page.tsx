import { forbidden, unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { DatasetSettingsDelete } from "@/components/dataset/tabs/settings/delete/DatasetSettingsDelete";
import { DatasetSettingsGraphics } from "@/components/dataset/tabs/settings/graphics/DatasetSettingsGraphics";
import { DatasetSettingsTitle } from "@/components/dataset/tabs/settings/title/DatasetSettingsTitle";
import { TabHeader } from "@/components/ui/tab-header";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const { id } = await params;
  const dataset = await caller.dataset.find.byId({ datasetId: Number(id) });

  if (!isPriviliged(session?.user.role) && dataset.userId !== session?.user.id) {
    return forbidden();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <TabHeader title="Dataset Settings" />
        <div className="text-muted-foreground">(Only visible to you)</div>
      </div>
      <div className="space-y-6">
        <DatasetSettingsTitle />
        <hr />
        <DatasetSettingsGraphics />
        <hr />
        <DatasetSettingsDelete dataset={dataset} session={session} />
      </div>
    </div>
  );
}
