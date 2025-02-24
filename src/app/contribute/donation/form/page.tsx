import Link from "next/link";

import { ZipFileUploadForm } from "@/components/dataset/forms/ZipFileUploadForm";
import { CONTACT_ROUTE, CONTRIBUTE_DONATION_ROUTE } from "@/lib/routes";

export default function Page() {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-uci-blue">Upload Dataset</h1>
        <div className="text-lg">
          Provide a title for your dataset and upload its files to start the
          donation process. Once uploaded, you can add more details and submit
          your dataset for review.
        </div>
        <ZipFileUploadForm />
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
