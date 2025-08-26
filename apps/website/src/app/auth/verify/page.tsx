import { auth } from "@packages/auth/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { VerifyForm } from "@/components/auth/verify/verify-form";
import { VerifyInvalidEmailAlert } from "@/components/auth/verify/verify-invalid-email-alert";
import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/server";

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

  const { email } = await searchParams;

  const user = await trpc.user.find.byEmail({ email });

  return (
    <div className="flex grow items-center justify-center">
      <Card className="w-full max-w-[30rem] max-md:invisible">
        <CardHeader>
          <MLRepoLogo variant="logo" className="text-wrap" />
        </CardHeader>
        <CardContent className="pt-0">
          {!user.emailVerified ? <VerifyForm email={email} /> : <VerifyInvalidEmailAlert />}
        </CardContent>
      </Card>
    </div>
  );
}
