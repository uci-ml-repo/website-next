"use client";

import type { Session } from "@packages/auth/auth";
import { authClient } from "@packages/auth/auth-client";

export function useSessionWithInitial(initialSession: Session | null) {
  const { data: session, isPending } = authClient.useSession();

  return isPending ? initialSession : session;
}
