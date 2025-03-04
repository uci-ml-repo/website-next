import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Banner } from "@/components/icons";
import { ErrorGraphic } from "@/components/layout/ErrorGraphic";
import { Main } from "@/components/layout/Main";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HOME_ROUTE, PROFILE_SETTINGS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export const metadata: Metadata = { title: "Verify Email" };

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const parsedToken = decodeURIComponent(token);

  const existingToken = await caller.user.credentials.getEmailVerificationToken(
    {
      token: parsedToken,
    },
  );

  if (!existingToken.success) {
    return (
      <ErrorGraphic header={existingToken.message}>
        <div>
          <a
            href={PROFILE_SETTINGS_ROUTE}
            className="text-link hover:underline"
          >
            Generate another token
          </a>
        </div>
      </ErrorGraphic>
    );
  }

  let user;
  try {
    user = await caller.user.credentials.verifyEmail({ token: parsedToken });
  } catch (error) {
    return (
      <ErrorGraphic header={(error as Error).message}>
        <div className="text-lg">
          <span>Go back </span>
          <a href={HOME_ROUTE} className="text-link hover:underline">
            Home
          </a>
        </div>
      </ErrorGraphic>
    );
  }

  return (
    <Main>
      {/* Mobile View */}
      <div className="mx-auto flex max-w-[450px] flex-col items-center space-y-4 sm:hidden">
        <div className="text-xl font-bold">Email Verified</div>
        <Alert variant="positive">
          <div className="flex items-center space-x-2">
            <CheckIcon />
            <div>{user.email} has been successfully verified</div>
          </div>
        </Alert>
        <div>You can now exit this page</div>
        <Button className="w-full" variant="blue" asChild>
          <Link href={HOME_ROUTE}>Home</Link>
        </Button>
      </div>

      {/* Desktop View */}
      <Card className="mx-auto hidden w-[450px] flex-col items-center rounded-4xl p-4 sm:flex">
        <CardHeader className="py-6">
          <Banner variant="logo" link />
        </CardHeader>
        <CardContent className="w-full space-y-6">
          <div className="space-y-4">
            <div className="text-xl font-bold">Email Verified</div>
            <Alert variant="positive">
              <div className="flex items-center space-x-2">
                <CheckIcon />
                <div>{user.email} has been successfully verified</div>
              </div>
            </Alert>
            <div>You can now exit this page</div>
            <Button className="w-full" variant="blue" asChild>
              <Link href={HOME_ROUTE}>Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Main>
  );
}
