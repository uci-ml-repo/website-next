"use client";

import { Loader2Icon } from "lucide-react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Props extends ComponentProps<typeof Button> {
  children?: ReactNode;
  icon?: ReactNode;
  pending?: boolean;
}

export function AuthButton({ onClick, disabled, icon, children, pending, ...props }: Props) {
  const [_pending, setPending] = useState(false);
  const isPending = _pending || pending;

  async function handleAuth(e: MouseEvent<HTMLButtonElement>) {
    setPending(true);
    if (onClick) await onClick(e);
    setPending(false);
  }

  return (
    <Button
      className="w-full"
      variant="outline"
      size="lg"
      onClick={handleAuth}
      disabled={isPending || disabled}
      {...props}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : icon}
      {children}
    </Button>
  );
}
