"use client";

import { CheckIcon } from "lucide-react";
import type { Session } from "next-auth";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export default function ProfileSettingsEmail({
  session,
}: {
  session: Session;
}) {
  const verifyEmailMutation =
    trpc.user.credentials.sendVerificationEmail.useMutation();

  function onClickVerifyEmail() {
    verifyEmailMutation.mutate({});
  }

  return (
    <Card>
      <CardContent className="space-y-2 px-4">
        <h3 className="text-lg font-bold">Email</h3>

        <div className="flex h-10 items-center justify-between text-lg">
          <div>{session.user.email}</div>
          {session.user.emailVerified ? (
            <div className="text-positive">
              <CheckIcon /> Verified
            </div>
          ) : (
            !verifyEmailMutation.isSuccess && (
              <Button
                variant="gold"
                onClick={onClickVerifyEmail}
                disabled={verifyEmailMutation.isPending}
              >
                {verifyEmailMutation.isPending && <Spinner />} Verify
              </Button>
            )
          )}
        </div>
        {verifyEmailMutation.isSuccess && (
          <Alert
            variant="positive"
            className="flex items-center justify-between"
          >
            <div>Verification email sent</div>
            <button onClick={onClickVerifyEmail} className="text-link">
              Resend
            </button>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
