import { ProviderAuth } from "@components/auth/provider/provider-auth";
import { FaGithub } from "react-icons/fa6";

export function GithubAuth() {
  return (
    <ProviderAuth provider="github" icon={<FaGithub />}>
      Sign in with Github
    </ProviderAuth>
  );
}
