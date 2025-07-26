import { ProviderAuth } from "@components/auth/button/provider-auth";
import type { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa6";

export function GoogleAuth({ children }: { children?: ReactNode }) {
  return (
    <ProviderAuth provider="google" icon={<FaGoogle />}>
      {children}
    </ProviderAuth>
  );
}
