import { Button } from "@components/ui/button";
import { authClient } from "@lib/auth-client";
import type { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa6";

export function GoogleAuth({ children }: { children?: ReactNode }) {
  return (
    <Button
      className="w-full"
      variant="outline"
      size="lg"
      onClick={async () => {
        await authClient.signIn.social({
          provider: "google",
        });
      }}
    >
      <FaGoogle />
      {children}
    </Button>
  );
}
