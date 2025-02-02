"use client";

import { EllipsisVerticalIcon, FlagIcon, Link2Icon } from "lucide-react";
import path from "path";
import { useState } from "react";

import DatasetReportDialog from "@/components/dataset/interactions/extended/DatasetReportDialog";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DATASET_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export default function DatasetExtendedOptions({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
          <DropdownMenuItem destructive onClick={() => setIsDialogOpen(true)}>
            <FlagIcon />
            <span>Report Issue</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DatasetReportDialog
        dataset={dataset}
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
      />
    </>
  );
}
