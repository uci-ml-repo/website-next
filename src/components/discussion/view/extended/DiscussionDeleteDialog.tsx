import { redirect } from "next/navigation";
import path from "path";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { DATASET_ROUTE } from "@/lib/routes";
import type { DiscussionResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionDeleteDialogProps {
  discussion: DiscussionResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DiscussionDeleteDialog({
  discussion,
  open,
  setOpen,
}: DiscussionDeleteDialogProps) {
  const utils = trpc.useUtils();

  const removeMutation = trpc.discussion.remove.byId.useMutation({
    onSuccess: async () => {
      await utils.discussion.find.byQuery.invalidate({
        datasetId: discussion.datasetId,
      });
    },
  });

  function removeDiscussion() {
    removeMutation.mutate({ discussionId: discussion.id });
    redirect(path.join(DATASET_ROUTE(discussion.dataset), "discussions"));
  }

  const pending = removeMutation.isPending || removeMutation.isSuccess;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Delete Discussion</DialogTitle>
        <div>Are you sure you want to delete this discussion?</div>
        <div>This action can not be undone.</div>
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={removeDiscussion}
          >
            {pending && <Spinner />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
