import { auth } from "@packages/auth";
import { Enums } from "@packages/db/enum";
import { InfoIcon } from "lucide-react";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";

import { DatasetDraftEditor } from "@/components/dataset/donation/dataset-draft-editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROUTES } from "@/lib/routes";
import { isPrivileged } from "@/server/trpc/middleware/util/role";
import { trpc } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user)
    redirect(ROUTES.AUTH.SIGN_IN({ callback: ROUTES.DATASET.SETTINGS({ id: Number(id), slug }) }));
  const dataset = await trpc.dataset.find.simpleById({ datasetId: Number(id) });
  const owner = session.user.id === dataset.userId;
  if (!owner && !isPrivileged(session.user.role)) forbidden();

  if (owner && dataset.status === Enums.ApprovalStatus.DRAFT) {
    return <DatasetDraftEditor dataset={dataset} />;
  }

  return (
    <Alert variant="blue">
      <InfoIcon />
      <AlertTitle>
        {dataset.status === Enums.ApprovalStatus.PENDING ? "Dataset in review" : "Dataset settings"}
      </AlertTitle>
      <AlertDescription>
        {dataset.status === Enums.ApprovalStatus.PENDING
          ? "Your dataset has been submitted to the repository team. Editing is locked during review."
          : owner
            ? "Only draft datasets can be edited here."
            : "Only the dataset owner can edit this draft."}
      </AlertDescription>
    </Alert>
  );
}
