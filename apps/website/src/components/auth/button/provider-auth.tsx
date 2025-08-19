"use client";

import { authClient } from "@packages/auth/auth-client";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import { AuthButton } from "@/components/auth/button/auth-button";

interface Props {
  children?: ReactNode;
  icon?: ReactNode;
  provider: string;
}

export function ProviderAuth({ children, icon, provider }: Props) {
  const [pending, setPending] = useState(false);

  async function providerAuth() {
    setPending(true);
    const { data, error } = await authClient.signIn.social({
      provider,
    });

    if (!data) {
      setPending(false);
    }

    if (error) {
      toast.error(`Failed to authenticate with ${provider}. Please try again.`);
    }
  }

  return (
    <AuthButton icon={icon} onClick={providerAuth} pending={pending}>
      {children}
    </AuthButton>
  );
}
