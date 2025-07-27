import type { Session } from "@lib/auth/auth";
import { authClient } from "@lib/auth/auth-client";

export function useSessionWithInitial(initialSession: Session | null) {
  const { data: _session, isPending } = authClient.useSession();

  return isPending ? initialSession : _session;
}
