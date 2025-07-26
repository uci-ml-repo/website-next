import { ProviderAuth } from "@components/auth/button/provider-auth";
import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa6";

export function GithubAuth({ children }: { children?: ReactNode }) {
  return (
    <ProviderAuth provider="github" icon={<FaGithub />}>
      {children}
    </ProviderAuth>
  );
}
