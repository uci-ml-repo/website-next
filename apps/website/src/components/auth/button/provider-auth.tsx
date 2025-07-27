"use client";

import { AuthButton } from "@components/auth/button/auth-button";
import { authClient } from "@lib/auth/auth-client";
import { type ReactNode, useState } from "react";

interface Props {
  children?: ReactNode;
  icon?: ReactNode;
  provider: string;
}

export function ProviderAuth({ children, icon, provider }: Props) {
  const [pending, setPending] = useState(false);

  async function providerAuth() {
    setPending(true);
    const { data } = await authClient.signIn.social({
      provider,
    });

    if (!data) {
      setPending(false);
    }
  }

  return (
    <AuthButton icon={icon} onClick={providerAuth} pending={pending}>
      {children}
    </AuthButton>
  );
}
