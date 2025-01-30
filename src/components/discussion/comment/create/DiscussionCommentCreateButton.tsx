import { PlusIcon } from "lucide-react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DiscussionCommentCreateButton({
  text,
  authedAction,
  className,
}: {
  text: string;
  authedAction: () => void;
  className?: string;
}) {
  return (
    <SignInRequired
      title="Sign in to comment"
      body="To comment and access other features, please sign in."
      authedAction={authedAction}
    >
      <Button variant="gold" className={cn("lift", className)}>
        <PlusIcon />
        <span>{text}</span>
      </Button>
    </SignInRequired>
  );
}
