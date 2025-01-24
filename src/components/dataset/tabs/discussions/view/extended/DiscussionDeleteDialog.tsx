import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionDeleteDialogProps {
  discussion: DiscussionResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DiscussionDeleteDialog({
  discussion,
  open,
  setOpen,
}: DiscussionDeleteDialogProps) {
  const utils = trpc.useUtils();

  const removeMutation = trpc.discussion.remove.byId.useMutation({
    onSuccess: () => {
      utils.discussion.find.byQuery.invalidate({
        datasetId: discussion.datasetId,
      });
    },
  });

  function removeDiscussion() {
    removeMutation.mutate({ discussionId: discussion.id });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Delete Comment</DialogTitle>
        <div>Are you sure you want to delete this discussion?</div>
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
