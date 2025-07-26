import { ProviderAuth } from "@components/auth/provider/provider-auth";
import { FaGoogle } from "react-icons/fa6";

export function GoogleAuth() {
  return (
    <ProviderAuth provider="google" icon={<FaGoogle />}>
      Sign in with Google
    </ProviderAuth>
  );
}
