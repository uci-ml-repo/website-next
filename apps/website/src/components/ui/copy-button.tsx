"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/cn";

type Props = ComponentProps<typeof Button> & {
  copyText: string;
  className?: string;
  children?: ReactNode;
};

export function CopyButton({ copyText, className, children, ...props }: Props) {
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
      size={children ? "default" : "icon"}
      className={cn("z-10 rounded-md", className)}
      onClick={copy}
      aria-label="Copy text"
      disabled={copied}
      {...props}
    >
      {copied ? (
        <CheckIcon className="text-positive" />
      ) : (
        <CopyIcon className="text-muted-foreground" />
      )}
      {children}
    </Button>
  );
}
