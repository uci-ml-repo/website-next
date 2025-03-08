"use client";

import { PlusIcon } from "lucide-react";

import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { useDataset } from "@/components/dataset/context/DatasetContext";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATASET_DISCUSSION_CREATE_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface DiscussionCreateButtonProps extends ButtonProps {
  className?: string;
  tooltip?: boolean;
}

export function DiscussionCreateButton({
  className,
  tooltip,
  ...props
}: DiscussionCreateButtonProps) {
  const { dataset } = useDataset();

  const CreateButton = () => (
    <Button
      variant="gold"
      size={tooltip ? "icon-lg" : "default"}
      className={cn("lift", className)}
      aria-label="Start discussion"
      {...props}
    >
      <PlusIcon />
      {!tooltip && <span>Start Discussion</span>}
    </Button>
  );

  return (
    <VerificationRequired
      signInTitle="Sign in to create discussions"
      signInBody="To create discussions and access other features, please sign in."
      verificationTitle="Verify your email to create discussions"
      verificationBody="To create discussions, please verify your email."
      verifiedRedirect={DATASET_DISCUSSION_CREATE_ROUTE(dataset)}
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
    </VerificationRequired>
  );
}
