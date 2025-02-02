import {
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import DiscussionCommentDeleteDialog from "@/components/discussion/comment/view/extended/DiscussionCommentDeleteDialog";
import DiscussionCommentReportDialog from "@/components/discussion/comment/view/extended/DiscussionCommentReportDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DiscussionCommentResponse } from "@/lib/types";

export default function DiscussionCommentExtendedOptions({
  discussionComment,
  setIsEditing,
}: {
  discussionComment: DiscussionCommentResponse;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();

  const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Extended options">
            <EllipsisVerticalIcon className="!size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {session?.user.id === discussionComment.user.id ? (
            <>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                destructive
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2Icon /> Delete
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              destructive
              onClick={() => setIsReportDialogOpen(true)}
            >
              <FlagIcon /> Report
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DiscussionCommentReportDialog
        discussionCommentId={discussionComment.id}
        open={isReportDialogOpen}
        setOpen={setIsReportDialogOpen}
      />
      <DiscussionCommentDeleteDialog
        discussionComment={discussionComment}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
