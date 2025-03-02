import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { Button } from "@/components/ui/button";
import {
  CONTRIBUTE_DONATION_ROUTE,
  CONTRIBUTE_EXTERNAL_FORM_ROUTE,
} from "@/lib/routes";

import Policy from "./policy.mdx";

export const metadata: Metadata = { title: "Contribute" };

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: CONTRIBUTE_DONATION_ROUTE });
  }

  return (
    <div>
      <Policy />

      <div className="space-y-2">
        <div className="text-muted-foreground">
          By clicking below, you agree to the linking policy.
        </div>
        <VerificationRequired
          signInBody="Sign in to link external datasets"
          signInTitle="To beigin the dataset linking process, plase sign in."
          verificationTitle="Verify your email to link external datasets"
          verificationBody="To link external datasets, please verify your email address."
          verifiedRedirect={CONTRIBUTE_EXTERNAL_FORM_ROUTE}
        >
          <Button className="lift w-full" variant="gold" size="lg">
            <PlusIcon /> Link External Dataset
          </Button>
        </VerificationRequired>
      </div>
    </div>
  );
}
