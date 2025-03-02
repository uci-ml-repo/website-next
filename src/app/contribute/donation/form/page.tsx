import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DatasetCreateForm } from "@/components/dataset/forms/DatasetCreateForm";
import { CONTACT_ROUTE, CONTRIBUTE_DONATION_ROUTE } from "@/lib/routes";

export default async function Page() {
  const session = await auth();

  if (!session?.user.emailVerified) {
    return redirect(CONTRIBUTE_DONATION_ROUTE);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-uci-blue">Create Dataset</h1>
        <div className="text-lg">
          Provide a title for your dataset to begin the donation process. You'll
          have the opportunity to upload files, add details, and submit your
          dataset for review in the next steps.
        </div>
        <DatasetCreateForm />
      </div>
      <div className="text-sm text-muted-foreground">
        <div>
          By submitting a dataset, you agree to our{" "}
          <Link href={CONTRIBUTE_DONATION_ROUTE} className="underline">
            donation policy
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
