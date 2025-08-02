"use client";

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
      spinner={isPending}
      {...props}
    >
      {!isPending && icon}
      {children}
    </Button>
  );
}
