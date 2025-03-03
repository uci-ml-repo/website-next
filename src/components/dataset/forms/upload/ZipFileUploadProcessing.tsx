import Link from "next/link";

import { AlternativeCard } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_ROUTE } from "@/lib/routes";

export function ZipFileUploadProcessing() {
  return (
    <div className="space-y-2">
      <AlternativeCard className="text-muted-foreground">
        <div className="flex items-center gap-2 text-pretty text-center max-xs:flex-col">
          <Spinner />
          <span className="text-pretty">Your files are being processed.</span>
        </div>
        <div className="text-pretty text-center">
          This may take a few minutes. You can safely leave this page.
        </div>
      </AlternativeCard>
      <div className="text-muted-foreground">
        Having issues?{" "}
        <Link href={CONTACT_ROUTE} className="underline">
          Contact us
        </Link>
        .
      </div>
    </div>
  );
}
