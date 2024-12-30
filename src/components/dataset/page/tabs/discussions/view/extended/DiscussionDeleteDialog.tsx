import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import type { DatasetDiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionDeleteDialogProps {
  discussion: DatasetDiscussionResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DiscussionDeleteDialog({
  discussion,
  open,
  setOpen,
}: DiscussionDeleteDialogProps) {
  const removeMutation = trpc.discussions.remove.byId.useMutation();

  async function removeDiscussion() {
    await removeMutation.mutateAsync({ discussionId: discussion.id });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Delete Comment</DialogTitle>
        <div>
          <p>Are you sure you want to delete this comment?</p>
          {discussion.replies.length > 0 && (
            <p>Replies will not be affected.</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={removeMutation.isPending}
            onClick={() => {
              removeDiscussion();
            }}
          >
            {removeMutation.isPending && <Spinner />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
