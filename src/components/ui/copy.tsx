"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyProps {
  text: string;
}

export default function Copy({ text }: CopyProps) {
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef(null);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  if (typeof navigator.clipboard === "undefined") return <div />;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger
          asChild
          onClick={(event) => event.preventDefault()}
          ref={triggerRef}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute right-1.5 top-1.5 text-primary"
            onClick={copy}
            pill={false}
            aria-label="Copy text"
          >
            {copied ? <CheckIcon className="text-positive" /> : <CopyIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          onPointerDownOutside={(event) => {
            if (event.target === triggerRef.current) event.preventDefault();
          }}
        >
          <p>{copied ? "Copied" : "Copy"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
