import { PlusIcon } from "lucide-react";

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
  return (
    <div>
      {hasDiscussions ? (
        <Card>
          <CardContent className="flex h-[130px] items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="text-muted-foreground">
                There are no comments yet
              </div>
              <Button
                variant="gold"
                size="md"
                className="lift"
                onClick={() => setIsAuthoring(true)}
              >
                <PlusIcon />
                <span>Start the Discussion</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="gold"
          size="md"
          className="lift"
          onClick={() => setIsAuthoring(true)}
        >
          <PlusIcon />
          <span>Add Comment</span>
        </Button>
      )}
    </div>
  );
}
