"use client";

import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { CircleHelpIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { DATASET_CHANGELOG_ROUTE } from "@/lib/routes";
import { isDraftOrPending } from "@/lib/utils/dataset";

export function DatasetEditingCard() {
  const { editing, setEditing, edited, dataset } = useDataset();

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  return (
    editing &&
    !isDraftOrPending(dataset) && (
      <>
        <Card className="w-full bg-uci-gold text-uci-gold-foreground animate-in fade-in-0">
          <CardContent className="flex items-center justify-between gap-y-2 px-4 py-2 max-md:flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-pretty text-center text-lg font-bold">
                You are editing this dataset
              </span>
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger>
                  <CircleHelpIcon className="size-5 cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent className="space-y-2">
                  <p className="font-bold">Edits require approval</p>
                  <p>
                    Edits made on this dataset must be approved before becoming
                    public.
                  </p>
                  <p>
                    You can review your pending edits in the{" "}
                    <Link
                      href={DATASET_CHANGELOG_ROUTE(dataset)}
                      className="underline"
                    >
                      changelog
                    </Link>
                    .
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="flex gap-2 max-xs:w-full max-xs:flex-col">
              <Button
                variant="secondary"
                size="default"
                className="lift"
                onClick={() => {
                  if (edited) {
                    setCancelDialogOpen(true);
                  } else {
                    setEditing(false);
                  }
                }}
              >
                Cancel
              </Button>
              <Button variant="default" size="default" className="lift">
                Submit for review
              </Button>
            </div>
          </CardContent>
        </Card>
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Discard edits?</DialogTitle>
            <p>
              You have dataset edits in progress, discard them without saving?
            </p>
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setEditing(false);
                  setCancelDialogOpen(false);
                }}
              >
                Discard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  );
}
