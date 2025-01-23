import { PlusIcon } from "lucide-react";
import type { Session } from "next-auth";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";

export default function DiscussionCreateButton({
  text,
  session,
  authedRedirect,
}: {
  text: string;
  session: Session | null;
  authedRedirect: string;
}) {
  return (
    <SignInRequired
      title="Sign in to comment"
      body="To comment and access other features, please sign in."
      authedRedirect={authedRedirect}
      session={session}
    >
      <Button variant="gold" className="lift">
        <PlusIcon />
        <span>{text}</span>
      </Button>
    </SignInRequired>
  );
}
