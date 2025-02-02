"use client";

import { PlusIcon } from "lucide-react";

import SignInRequired from "@/components/auth/SignInRequired";
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
    <SignInRequired
      title="Sign in to create discussions"
      body="To create discussions and access other features, please sign in."
      authedRedirect="discussions/create"
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
    </SignInRequired>
  );
}
