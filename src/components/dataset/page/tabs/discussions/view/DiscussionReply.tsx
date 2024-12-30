import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DiscussionResponse } from "@/lib/types";

export default function DiscussionReply({
  discussion,
}: {
  discussion: DiscussionResponse;
}) {
  return (
    <Button variant="ghost" size="sm">
      <MessageCircleIcon /> Reply
    </Button>
  );
}
