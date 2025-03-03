import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "@/components/hooks/use-toast";
import { AlertIrreversible } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_ROUTE, PROFILE_DATASETS_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

export function DatasetDiscardDialog({
  dataset,
  open,
  setOpen,
}: {
  dataset: DatasetResponse;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [confirmInput, setConfirmInput] = useState<string>("");

  const datasetRemoveMutation = trpc.dataset.remove.byId.useMutation({
    onSuccess: () => router.push(PROFILE_DATASETS_ROUTE),
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Discard {dataset.title}?</DialogTitle>
        <DialogHeader className="space-y-4">
          <AlertIrreversible />
          <ul className="list-inside list-disc">
            <li>All associated files will be removed</li>
            <li>Associated metadata will be deleted</li>
          </ul>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-muted-foreground">
            For dataset related questions{" "}
            <Link href={CONTACT_ROUTE} className="underline">
              contact us
            </Link>
            .
          </div>
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
