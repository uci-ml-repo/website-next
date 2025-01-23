"use client";

import { EllipsisVerticalIcon, FlagIcon, Link2Icon } from "lucide-react";
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
import type { DatasetResponse } from "@/lib/types";

export default function DatasetExtendedOptions({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function copyLink() {
    if (typeof navigator.clipboard === "undefined") return;

    await navigator.clipboard.writeText(
      window.location.origin + window.location.pathname,
    );

    toast({
      title: "Dataset Link Copied",
      description: window.location.origin + window.location.pathname,
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
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
