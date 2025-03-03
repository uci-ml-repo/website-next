import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_ROUTE } from "@/lib/routes";

export function ZipFileUploadProcessing() {
  return (
    <div className="space-y-2">
      <Card className="w-full">
        <CardContent className="flex h-32 flex-col items-center justify-center bg-muted text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Spinner />
            <span>
              Your files are being processed. This may take a few minutes. You
              can safely leave this page.
            </span>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground">
        Having issues?{" "}
        <Link href={CONTACT_ROUTE} className="underline">
          Contact us
        </Link>
      </div>
    </div>
  );
}
