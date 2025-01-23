"use client";

import { MessageCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import SignInRequired from "@/components/auth/SignInRequired";
import DiscussionCreateInput from "@/components/dataset/tabs/discussions/create/DiscussionCreateInput";
import { Button } from "@/components/ui/button";
import type { DiscussionResponse } from "@/lib/types";

export default function DiscussionCreateReply({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  const { data: session } = useSession();
  const [isAuthoring, setIsAuthoring] = useState<boolean>(false);

  return isAuthoring ? (
    <div>
      <DiscussionCreateInput
        datasetId={discussion.datasetId}
        setIsAuthoring={setIsAuthoring}
        replyTo={discussion}
      />
    </div>
  ) : (
    <SignInRequired
      title="Sign In to Reply"
      body="To reply to discussions and access other features, please sign in"
      authedAction={() => setIsAuthoring(true)}
      session={session}
    >
      <Button variant="ghost" size="sm">
        <MessageCircleIcon /> Reply
      </Button>
    </SignInRequired>
  );
}
