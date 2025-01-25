import { PlusIcon } from "lucide-react";
import type { Session } from "next-auth";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DiscussionCreateButton({
  text,
  session,
  authedRedirect,
  className,
}: {
  text: string;
  session: Session | null;
  authedRedirect: string;
  className?: string;
}) {
  return (
    <SignInRequired
      title="Sign in to comment"
      body="To comment and access other features, please sign in."
      authedRedirect={authedRedirect}
      session={session}
    >
      <Button variant="gold" className={cn("lift", className)}>
        <PlusIcon />
        <span>{text}</span>
      </Button>
    </SignInRequired>
  );
}
