import Link from "next/link";

import { DatasetExternalCreateForm } from "@/components/dataset/forms/DatasetExternalCreateForm";
import { CONTACT_ROUTE, CONTRIBUTE_EXTERNAL_ROUTE } from "@/lib/routes";

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-uci-blue">
          Link External Dataset
        </h1>
        <div className="text-lg">
          Provide a title and URL to your dataset to begin the donation process.
          You'll have the opportunity to add details and submit your dataset for
          review in the next steps.
        </div>
        <DatasetExternalCreateForm />
      </div>
      <div className="text-sm text-muted-foreground">
        <div>
          By linking an external dataset, you agree to our{" "}
          <Link href={CONTRIBUTE_EXTERNAL_ROUTE} className="underline">
            linking policy
          </Link>
          . Having issues?{" "}
          <Link href={CONTACT_ROUTE} className="underline">
            Contact us
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
