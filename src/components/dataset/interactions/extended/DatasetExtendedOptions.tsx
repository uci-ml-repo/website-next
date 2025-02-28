"use client";

import {
  EllipsisVerticalIcon,
  FlagIcon,
  Link2Icon,
  Trash2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import path from "path";
import { useState } from "react";

import { DatasetDiscardDialog } from "@/components/dataset/interactions/extended/DatasetDiscardDialog";
import { DatasetReportDialog } from "@/components/dataset/interactions/extended/DatasetReportDialog";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Enums } from "@/db/lib/enums";
import { DATASET_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export function DatasetExtendedOptions({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const { data: session } = useSession();

  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  async function copyLink() {
    if (typeof navigator.clipboard === "undefined") return;

    const link = path.join(
      window.location.origin,
      DATASET_ROUTE({ slug: dataset.slug, id: dataset.id }),
    );

    await navigator.clipboard.writeText(link);

    toast({
      title: "Dataset Link Copied",
      description: link,
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Extended options">
            <EllipsisVerticalIcon className="!size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {navigator.clipboard && (
            <DropdownMenuItem onClick={copyLink}>
              <Link2Icon />
              <span>Copy Link</span>
            </DropdownMenuItem>
          )}
          {dataset.status === Enums.ApprovalStatus.DRAFT && (
            <DropdownMenuItem
              destructive
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2Icon />
              <span>Discard Draft</span>
            </DropdownMenuItem>
          )}
          {(!session || session.user.id !== dataset.userId) && (
            <DropdownMenuItem
              destructive
              onClick={() => setReportDialogOpen(true)}
            >
              <FlagIcon />
              <span>Report Issue</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DatasetReportDialog
        dataset={dataset}
        open={reportDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
      <DatasetDiscardDialog
        dataset={dataset}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
}
