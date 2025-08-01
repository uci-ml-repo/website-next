import { VerifyContent } from "@components/auth/verify/verify";
import { MLRepoLogo } from "@components/logo/ml-repo";
import { Alert, AlertTitle } from "@components/ui/alert";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { auth } from "@lib/auth/auth";
import { ROUTES } from "@lib/routes";
import { trpc } from "@server/trpc/query/server";
import { AlertCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(ROUTES.HOME);
  }

  const email = (await searchParams).email;

  const user = await trpc.user.find.byEmail({ email });

  return (
    <div className="flex grow items-center justify-center">
      <Card className="w-full max-w-[30rem] max-md:invisible">
        <CardHeader>
          <MLRepoLogo variant="logo" className="text-wrap" />
        </CardHeader>
        <CardContent>
          {!user.emailVerified ? (
            <VerifyContent email={email} />
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive" className="animate-in fade-in">
                <AlertCircleIcon />
                <AlertTitle>Invalid email supplied</AlertTitle>
              </Alert>
              <div className="text-center">
                <Link href={ROUTES.AUTH.SIGN_IN} className="text-link underline">
                  Return to sign in page
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
