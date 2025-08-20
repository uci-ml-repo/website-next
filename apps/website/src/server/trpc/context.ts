import { auth } from "@packages/auth/auth";
import { headers } from "next/headers";

export async function createContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return { session };
}
