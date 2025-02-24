import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import { SignInRequired } from "@/components/auth/SignInRequired";
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
      <div>
        <Policy />
      </div>

      <div className="space-y-2">
        <div className="text-muted-foreground">
          By clicking below, you agree to the linking policy.
        </div>
        <SignInRequired
          title="Sign in to link external datasets"
          body="To beigin the dataset linking process, plase sign in."
          authedRedirect={CONTRIBUTE_EXTERNAL_FORM_ROUTE}
        >
          <Button className="lift w-full" variant="gold" size="lg">
            <PlusIcon /> Link External Dataset
          </Button>
        </SignInRequired>
      </div>
    </div>
  );
}
