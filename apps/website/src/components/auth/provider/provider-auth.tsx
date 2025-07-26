"use client";

import { Button } from "@components/ui/button";
import { authClient } from "@lib/auth-client";
import { Loader2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface Props {
  children?: ReactNode;
  icon?: ReactNode;
  provider: string;
}

export function ProviderAuth({ children, icon, provider }: Props) {
  const [pending, setPending] = useState(false);

  async function handleAuth() {
    setPending(true);

    await authClient.signIn.social({
      provider,
    });
  }

  return (
    <Button className="w-full" variant="outline" size="lg" onClick={handleAuth} disabled={pending}>
      {pending ? <Loader2Icon className="animate-spin" /> : icon}
      {children}
    </Button>
  );
}
