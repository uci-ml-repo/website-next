"use client";

import {
  CogIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  Link2Icon,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import path from "path";
import { useState } from "react";

import { DatasetReportDialog } from "@/components/dataset/interactions/extended/DatasetReportDialog";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DATASET_ROUTE, DATASET_SETTINGS_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export function DatasetExtendedOptions({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const { data: session } = useSession();

  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);

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

          {(!session || session.user.id !== dataset.userId) && (
            <DropdownMenuItem
              destructive
              onClick={() => setReportDialogOpen(true)}
            >
              <FlagIcon />
              <span>Report Issue</span>
            </DropdownMenuItem>
          )}

          {session &&
            (isPriviliged(session.user.role) ||
              session.user.id === dataset.userId) && (
              <Link href={DATASET_SETTINGS_ROUTE(dataset)}>
                <DropdownMenuItem>
                  <CogIcon />
                  <span>Dataset Settings</span>
                </DropdownMenuItem>
              </Link>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DatasetReportDialog
        dataset={dataset}
        open={reportDialogOpen}
        setOpen={setReportDialogOpen}
      />
    </>
  );
}
