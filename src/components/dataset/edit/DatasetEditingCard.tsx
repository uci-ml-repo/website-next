"use client";

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

export function DatasetEditingCard() {
  const { editing, setEditing } = useDataset();

  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);

  return (
    editing && (
      <>
        <Card className="w-full bg-uci-gold text-uci-gold-foreground">
          <CardContent className="flex items-center justify-between px-4 py-2 max-md:flex-col">
            <div className="text-pretty text-center text-lg font-bold">
              You are editing this dataset
            </div>
            <div className="space-x-2">
              <Button
                variant="secondary"
                size="default"
                className="lift"
                onClick={() => setCancelDialogOpen(true)}
              >
                Cancel
              </Button>
              <Button variant="default" size="default" className="lift">
                Save
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
