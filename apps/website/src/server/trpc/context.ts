import { authClient } from "@website/lib/auth/auth-client";

export async function createContext() {
  const { data: session } = await authClient.getSession();

  return {
    session,
  };
}
