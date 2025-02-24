"use client";

import {
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { DiscussionDeleteDialog } from "@/components/discussion/view/extended/DiscussionDeleteDialog";
import { DiscussionReportDialog } from "@/components/discussion/view/extended/DiscussionReportDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DATASET_DISCUSSION_EDIT_ROUTE } from "@/lib/routes";
import type { DiscussionResponse } from "@/lib/types";

export function DiscussionExtendedOptions({
  discussion,
}: {
  discussion: DiscussionResponse;
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
          {session?.user.id === discussion.user.id ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={DATASET_DISCUSSION_EDIT_ROUTE({
                    id: discussion.dataset.id,
                    slug: discussion.dataset.slug,
                    discussionId: discussion.id,
                  })}
                >
                  <PencilIcon />
                  Edit
                </Link>
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
      <DiscussionReportDialog
        discussionId={discussion.id}
        open={isReportDialogOpen}
        setOpen={setIsReportDialogOpen}
      />
      <DiscussionDeleteDialog
        discussion={discussion}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
