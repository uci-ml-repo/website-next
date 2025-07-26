import { authClient } from "@lib/auth-client";

export async function createContext() {
  const { data: session } = await authClient.getSession();

  return {
    session,
  };
}
