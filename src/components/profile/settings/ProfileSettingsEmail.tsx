"use client";

import { CheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { usePoll } from "@/components/hooks/use-poll";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/server/trpc/query/client";

export function ProfileSettingsEmail() {
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
    <div>
      <h3 className="text-lg font-bold">Your Email Address</h3>

      {session ? (
        <div className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="truncate text-lg text-muted-foreground">
                {session.user.email}
              </div>
              {session.user.emailVerified && (
                <Tooltip>
                  <TooltipTrigger>
                    <CheckIcon className="size-5 text-positive" />
                  </TooltipTrigger>
                  <TooltipContent>Email Verified</TooltipContent>
                </Tooltip>
              )}
            </div>
            {!session.user.emailVerified && !verifyEmailMutation.isSuccess && (
              <Button
                variant="outline"
                onClick={onClickVerifyEmail}
                disabled={verifyEmailMutation.isPending}
              >
                {verifyEmailMutation.isPending && <Spinner />} Verify Email
              </Button>
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
        </div>
      ) : (
        <div className="flex h-10 items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
