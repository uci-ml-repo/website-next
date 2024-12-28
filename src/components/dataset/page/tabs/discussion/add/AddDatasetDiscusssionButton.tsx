import { PlusIcon } from "lucide-react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

import SignInRequired from "@/components/auth/SignInRequired";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AddDatasetDiscussionProps {
  hasDiscussions: boolean;
  setIsAuthoring: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddDatasetDiscussionButton({
  hasDiscussions,
  setIsAuthoring,
}: AddDatasetDiscussionProps) {
  const { data: session } = useSession();

  console.log(session);

  return (
    <div>
      {hasDiscussions ? (
        <Card>
          <CardContent className="flex h-[130px] items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="text-muted-foreground">
                There are no comments yet
              </div>
              <CreateDiscussionButton
                text="Start the discussion"
                session={session}
                authAction={() => setIsAuthoring(true)}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <CreateDiscussionButton
          text="Add Discussion"
          session={session}
          authAction={() => setIsAuthoring(true)}
        />
      )}
    </div>
  );
}

function CreateDiscussionButton({
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
