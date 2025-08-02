"use client";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Separator } from "@components/ui/separator";
import { ROUTES } from "@lib/routes";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function ForgotPasswordInvalidToken() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Invalid link</AlertTitle>
        <AlertDescription>
          The link you are attempting to use is invalid or expired.
        </AlertDescription>
      </Alert>
      <Separator />
      <div className="text-center">
        <button
          className="text-muted-foreground cursor-pointer hover:underline"
          onClick={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD)}
        >
          Request another link
        </button>
      </div>
    </div>
  );
}
