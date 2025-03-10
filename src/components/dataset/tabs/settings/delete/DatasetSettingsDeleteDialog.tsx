"use client";

import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { useState } from "react";

import { toast } from "@/components/hooks/use-toast";
import { AlertWarning } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_ROUTE, PROFILE_DATASETS_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { isSuperPriviliged } from "@/server/trpc/middleware/lib/roles";
import { trpc } from "@/server/trpc/query/client";

export function DatasetSettingsDeleteDialog({
  dataset,
  session,
}: {
  dataset: DatasetResponse;
  session: Session;
}) {
  const router = useRouter();
  const [confirmInput, setConfirmInput] = useState<string>("");

  const datasetRemoveMutation = trpc.dataset.remove.byId.useMutation({
    onSuccess: (dataset) => {
      toast({
        title: "Dataset deleted",
        description: `${dataset.title} has successfully been deleted`,
      });
      router.push(PROFILE_DATASETS_ROUTE);
    },
    onError: (error) => {
      toast({
        title: "Error deleting dataset",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function deleteDataset() {
    datasetRemoveMutation.mutate({
      datasetId: dataset.id,
    });
  }

  const isDeleting =
    datasetRemoveMutation.isPending || datasetRemoveMutation.isSuccess;

  const confirmed = confirmInput.trim() === "delete me";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline-destructive" size="lg">
          <Trash2Icon />
          <span>Delete Dataset</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete {dataset.title}?</DialogTitle>
        <DialogHeader className="space-y-4">
          <AlertWarning>this action cannot be undone.</AlertWarning>
          <ul className="list-inside list-disc">
            <li>All associated files will be deleted</li>
            <li>Associated metadata will be deleted</li>
          </ul>
        </DialogHeader>

        <div className="space-y-4">
          {!isSuperPriviliged(session.user.role) && (
            <div className="text-muted-foreground">
              For dataset related questions{" "}
              <Link href={CONTACT_ROUTE} className="underline">
                contact us
              </Link>
              .
            </div>
          )}
          <div className="select-none space-y-1">
            <div className="text-muted-foreground">
              To confirm, type <span className="font-bold">delete me</span>{" "}
              below.
            </div>
            <Input
              onChange={(e) => setConfirmInput(e.target.value)}
              value={confirmInput}
            />
          </div>
        </div>

        <DialogFooter className="items-center !justify-between gap-4">
          <DialogClose asChild>
            <Button variant="secondary" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={!confirmed || isDeleting}
            onClick={deleteDataset}
          >
            {isDeleting && <Spinner />} Delete dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
