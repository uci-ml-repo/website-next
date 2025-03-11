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

export function DatasetEditing() {
  const { editing, setEditing, dataset, editingFields } = useDataset();

  const [cancelDialogOpen, setFinishEditingDialogOpen] =
    useState<boolean>(false);

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
                  if (Object.values(editingFields).some((value) => value)) {
                    setFinishEditingDialogOpen(true);
                  } else {
                    setEditing(false);
                  }
                }}
              >
                Finish editing
              </Button>
            </div>
          </CardContent>
        </Card>
        <Dialog
          open={cancelDialogOpen}
          onOpenChange={setFinishEditingDialogOpen}
        >
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Discard edits?</DialogTitle>
            <div>
              You have the following dataset edits in progress, discard them
              without saving?
            </div>
            <ul className="list-inside list-disc">
              {Object.entries(editingFields).map(([field, editing]) =>
                editing ? (
                  <li key={field} className="font-bold">
                    {field}
                  </li>
                ) : null,
              )}
            </ul>
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button variant="secondary">Continue editing</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  setEditing(false);
                  setFinishEditingDialogOpen(false);
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
