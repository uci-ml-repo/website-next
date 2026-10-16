import Link from "next/link";

import { DatasetDraftCreate } from "@/components/dataset/donation/dataset-draft-create";
import { ROUTES } from "@/lib/routes";

export default function Page() {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create a dataset draft</h1>
        <p className="text-muted-foreground">
          Start with the basics. You can edit details, upload data, and submit for review after
          creating your draft.
        </p>
      </div>
      <DatasetDraftCreate />
      <Link href={ROUTES.PROFILE.DATASETS} className="text-sm underline underline-offset-4">
        Return to My datasets
      </Link>
    </>
  );
}
