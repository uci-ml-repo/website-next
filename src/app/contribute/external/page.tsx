"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CONTRIBUTE_EXTERNAL_FORM_ROUTE } from "@/lib/routes";

import Policy from "./policy.mdx";

export default function Page() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);

  return (
    <div>
      <Policy />

      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 text-lg text-muted-foreground"
          onClick={() => setChecked((prevState) => !prevState)}
        >
          <Checkbox checked={checked} tabIndex={-1} />
          <span>I agree to the linking policy.</span>
        </button>
        <VerificationRequired
          signInBody="Sign in to link external datasets"
          signInTitle="To beigin the dataset linking process, plase sign in."
          verificationTitle="Verify your email to link external datasets"
          verificationBody="To link external datasets, please verify your email address."
          verifiedRedirect={CONTRIBUTE_EXTERNAL_FORM_ROUTE}
          disabled={checked !== true}
        >
          <Button
            className="lift w-full"
            variant="gold"
            size="lg"
            disabled={checked !== true}
          >
            <PlusIcon /> Link External Dataset
          </Button>
        </VerificationRequired>
      </div>
    </div>
  );
}
