import { authClient } from "@packages/auth/auth-client";

export async function createContext() {
  const { data: session } = await authClient.getSession();

  return { session };
}
