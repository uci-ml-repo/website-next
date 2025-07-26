import type { Session } from "@lib/auth";
import { authClient } from "@website/lib/auth-client";

export function useSessionWithInitial(initialSession: Session | null) {
  const { data: _session, isPending } = authClient.useSession();

  return isPending ? initialSession : _session;
}
