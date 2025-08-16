"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/cn";

interface CopyProps {
  copyText: string;
  className?: string;
}

export function CopyButton({ copyText, className }: CopyProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("z-10 rounded-md !opacity-100", className)}
      onClick={copy}
      aria-label="Copy text"
      disabled={copied}
    >
      {copied ? (
        <CheckIcon className="text-positive" />
      ) : (
        <CopyIcon className="text-muted-foreground" />
      )}
    </Button>
  );
}
