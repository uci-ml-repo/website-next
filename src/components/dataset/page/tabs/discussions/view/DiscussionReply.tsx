import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DatasetDiscussionResponse } from "@/lib/types";

export default function DiscussionReply({
  discussion,
}: {
  discussion: DatasetDiscussionResponse;
}) {
  return (
    <Button variant="ghost" size="sm">
      <MessageCircleIcon /> Reply
    </Button>
  );
}
