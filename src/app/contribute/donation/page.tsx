import { PlusIcon } from "lucide-react";

import { auth, signIn } from "@/auth";
import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { Button } from "@/components/ui/button";
import {
  CONTRIBUTE_DONATION_FORM_ROUTE,
  CONTRIBUTE_DONATION_ROUTE,
} from "@/lib/routes";

import Policy from "./policy.mdx";

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
          By continuing, you agree to the donation policy.
        </div>
        <VerificationRequired
          signInTitle="Sign in to donate datasets"
          signInBody="To beigin the dataset donation process, plase sign in."
          verificationTitle="Verify your email to donate datasets"
          verificationBody="To donate datasets, please verify your email address."
          verifiedRedirect={CONTRIBUTE_DONATION_FORM_ROUTE}
        >
          <Button className="lift w-full" variant="gold" size="lg">
            <PlusIcon /> Donate Dataset
          </Button>
        </VerificationRequired>
      </div>
    </div>
  );
}
