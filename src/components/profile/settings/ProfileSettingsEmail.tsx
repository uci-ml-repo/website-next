"use client";

import { CheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { usePoll } from "@/components/hooks/use-poll";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export default function ProfileSettingsEmail({}: {}) {
  const { data: session, update } = useSession();

  const verifyEmailMutation =
    trpc.user.credentials.sendVerificationEmail.useMutation();

  function onClickVerifyEmail() {
    verifyEmailMutation.mutate({});
  }

  usePoll(() => {
    if (!session?.user.emailVerified) {
      update();
    }
  }, 5000);

  return (
    <Card>
      <CardContent className="space-y-2 px-4">
        <h3 className="text-lg font-bold">Email</h3>

        {session ? (
          <>
            <div className="flex h-10 items-center justify-between text-lg">
              <div>{session.user.email}</div>
              {session.user.emailVerified ? (
                <div className="flex items-center space-x-1 text-positive">
                  <CheckIcon />
                  <span>Verified</span>
                </div>
              ) : (
                !verifyEmailMutation.isSuccess && (
                  <Button
                    variant="gold"
                    onClick={onClickVerifyEmail}
                    disabled={verifyEmailMutation.isPending}
                  >
                    {verifyEmailMutation.isPending && <Spinner />} Verify Email
                  </Button>
                )
              )}
            </div>
            {verifyEmailMutation.isSuccess && !session.user.emailVerified && (
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
          </>
        ) : (
          <div className="flex h-10 items-center">
            <Spinner />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
