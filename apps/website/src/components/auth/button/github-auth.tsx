import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa6";

import { ProviderAuth } from "@/components/auth/button/provider-auth";

export function GithubAuth({ children }: { children?: ReactNode }) {
  return (
    <ProviderAuth provider="github" icon={<FaGithub />}>
      {children}
    </ProviderAuth>
  );
}
