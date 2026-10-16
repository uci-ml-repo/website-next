import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

import Contribution from "./contribution.mdx";

export default function Page() {
  return (
    <div className="blur-background mx-auto w-full max-w-4xl space-y-6">
      <Contribution />
      <Card>
        <CardHeader>
          <CardTitle>Donate a dataset</CardTitle>
          <CardDescription>
            Start with a title and description, then add details and upload your data at your own
            pace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Sign in to create a private draft. When it is ready, submit it for review by the
            repository team.
          </p>
          <Button variant="gold" asChild>
            <Link href={ROUTES.CONTRIBUTE.DONATION_FORM}>
              <PlusIcon />
              Create a dataset draft
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
