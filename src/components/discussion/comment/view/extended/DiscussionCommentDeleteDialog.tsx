import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { DiscussionCommentResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DiscussionDeleteDialogProps {
  discussionComment: DiscussionCommentResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DiscussionCommentDeleteDialog({
  discussionComment,
  open,
  setOpen,
}: DiscussionDeleteDialogProps) {
  const utils = trpc.useUtils();

  const removeMutation = trpc.discussion.comment.remove.byId.useMutation({
    onSuccess: async () => {
      await utils.discussion.comment.find.byQuery.invalidate({
        discussionId: discussionComment.discussionId,
      });
    },
  });

  function removeDiscussionComment() {
    removeMutation.mutate({ discussionCommentId: discussionComment.id });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Delete Comment</DialogTitle>
        <div>Are you sure you want to delete this comment?</div>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={removeMutation.isPending}
            onClick={removeDiscussionComment}
          >
            {removeMutation.isPending && <Spinner />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
