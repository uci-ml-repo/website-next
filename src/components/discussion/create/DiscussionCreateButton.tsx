"use client";

import { PlusIcon } from "lucide-react";

import EmailVerificationRequired from "@/components/auth/EmailVerificationRequired";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function DiscussionCreateButton({
  className,
  tooltip,
}: {
  className?: string;
  tooltip?: boolean;
}) {
  const CreateButton = () => (
    <Button
      variant="gold"
      size={tooltip ? "icon-lg" : "lg"}
      className={cn("lift", className)}
      aria-label="Start discussion"
    >
      <PlusIcon />
      {!tooltip && <span>Start Discussion</span>}
    </Button>
  );

  return (
    <EmailVerificationRequired
      signInTitle="Sign in to create discussions"
      signInBody="To create discussions and access other features, please sign in."
      emailVerificationTitle="Verify your email to create discussions"
      emailVerificationBody="To create discussions, please verify your email."
      verifiedRedirect="discussions/create"
    >
      {tooltip ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                <CreateButton />
              </div>
            </TooltipTrigger>
            <TooltipContent>Start Discussion</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <CreateButton />
      )}
    </EmailVerificationRequired>
  );
}
