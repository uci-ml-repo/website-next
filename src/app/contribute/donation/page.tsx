"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CONTRIBUTE_DONATION_FORM_ROUTE } from "@/lib/routes";

import Policy from "./policy.mdx";

export default function Page() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  return (
    <>
      <Policy />

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg text-muted-foreground">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <span>I agree to the donation policy.</span>
        </div>
        <VerificationRequired
          signInTitle="Sign in to donate datasets"
          signInBody="To beigin the dataset donation process, plase sign in."
          verificationTitle="Verify your email to donate datasets"
          verificationBody="To donate datasets, please verify your email address."
          verifiedRedirect={CONTRIBUTE_DONATION_FORM_ROUTE}
          disabled={checked !== true}
        >
          <Button
            className="lift w-full"
            variant="gold"
            size="lg"
            disabled={checked !== true}
          >
            <PlusIcon /> Donate Dataset
          </Button>
        </VerificationRequired>
      </div>
    </>
  );
}
