import { PlusIcon } from "lucide-react";

import EmailVerificationRequired from "@/components/auth/EmailVerificationRequired";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DiscussionCommentCreateButton({
  text,
  setIsCommenting,
  className,
}: {
  text: string;
  setIsCommenting: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  return (
    <EmailVerificationRequired
      signInTitle="Sign in to comment"
      signInBody="To comment and access other features, please sign in."
      emailVerificationTitle="Verify your email to comment"
      emailVerificationBody="To comment, please verify your email."
      verifiedAction={() => setIsCommenting(true)}
    >
      <Button variant="secondary" className={cn("lift", className)}>
        <PlusIcon />
        <span>{text}</span>
      </Button>
    </EmailVerificationRequired>
  );
}
