import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { ROUTES } from "@/lib/routes";

export function VerifyInvalidEmailAlert() {
  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="animate-in fade-in">
        <AlertCircleIcon />
        <AlertTitle>Invalid email</AlertTitle>
      </Alert>
      <div className="text-center">
        <Link href={ROUTES.AUTH.SIGN_IN} className="text-link underline">
          Return to sign in page
        </Link>
      </div>
    </div>
  );
}
