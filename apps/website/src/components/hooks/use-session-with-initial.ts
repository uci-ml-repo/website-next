import type { Session } from "@packages/auth/auth";
import { authClient } from "@packages/auth/auth-client";

export function useSessionWithInitial(initialSession: Session | null) {
  const { data: _session, isPending } = authClient.useSession();

  return isPending ? initialSession : _session;
}
