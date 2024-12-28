import { PlusIcon } from "lucide-react";
import type { Session } from "next-auth";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";

export default function CreateDiscussionButton({
  text,
  session,
  authAction,
}: {
  text: string;
  session: Session | null;
  authAction: () => void;
}) {
  return (
    <SignInRequired
      title="Sign in to comment"
      body="To comment and access other features, please sign in."
      authedAction={authAction}
      session={session}
    >
      <Button variant="gold" size="md" className="lift">
        <PlusIcon />
        <span>{text}</span>
      </Button>
    </SignInRequired>
  );
}
