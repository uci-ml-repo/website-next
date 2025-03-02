import { PlusIcon } from "lucide-react";

import { VerificationRequired } from "@/components/auth/VerificationRequired";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DiscussionCommentCreateButton({
  text,
  setIsCommenting,
  className,
}: {
  text: string;
  setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  return (
    <VerificationRequired
      signInTitle="Sign in to comment"
      signInBody="To comment and access other features, please sign in."
      verificationTitle="Verify your email to comment"
      verificationBody="To comment, please verify your email."
      verifiedAction={() => setIsCommenting(true)}
    >
      <Button variant="secondary" className={cn("lift", className)}>
        <PlusIcon />
        <span>{text}</span>
      </Button>
    </VerificationRequired>
  );
}
