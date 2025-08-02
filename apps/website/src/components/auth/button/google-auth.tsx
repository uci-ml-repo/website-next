import type { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa6";

import { ProviderAuth } from "@/components/auth/button/provider-auth";

export function GoogleAuth({ children }: { children?: ReactNode }) {
  return (
    <ProviderAuth provider="google" icon={<FaGoogle />}>
      {children}
    </ProviderAuth>
  );
}
