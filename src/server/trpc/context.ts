import { auth } from "@/auth";

export async function createContext() {
  const session = await auth();

  return {
    session,
  };
}
