"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CopyProps {
  copyText: string;
  absolute?: boolean;
  children?: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export function Copy({ copyText, absolute = true, children, className, tooltip }: CopyProps) {
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef(null);

  const copy = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild onClick={(event) => event.preventDefault()} ref={triggerRef}>
          <Button
            variant="outline"
            size={!children ? "icon" : "sm"}
            className={cn(
              "rounded-md text-primary",
              {
                "absolute right-1.5 top-1.5": absolute,
              },
              className,
            )}
            onClick={copy}
            aria-label="Copy text"
          >
            {copied ? <CheckIcon className="text-positive" /> : <CopyIcon />}
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          onPointerDownOutside={(event) => {
            if (event.target === triggerRef.current) event.preventDefault();
          }}
        >
          {copied ? "Copied" : (tooltip ?? "Copy")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
