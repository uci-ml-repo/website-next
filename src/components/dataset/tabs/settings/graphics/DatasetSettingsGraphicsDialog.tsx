"use client";

import { PencilIcon } from "lucide-react";
import { useState } from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetSettingsGraphicsUploadForm } from "@/components/dataset/tabs/settings/graphics/DatasetSettingsGraphicsUploadForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function DatasetSettingsGraphicsDialog({ resetThumbnail }: { resetThumbnail: () => void }) {
  const { setEditing } = useDataset();
  const [dialogOpen, _setDialogOpen] = useState<boolean>(false);

  function setDialogOpen(openState: boolean) {
    if (openState) {
      setEditing(true);
    }
    _setDialogOpen(openState);
  }

  function onUpload() {
    setDialogOpen(false);
    resetThumbnail();
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <PencilIcon /> Edit thumbnail
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-1">
          <DialogTitle>Edit thumbnail</DialogTitle>
          <div className="text-muted-foreground">Upload an image to appear with your dataset.</div>
        </div>
        <div className="min-w-0">
          <DatasetSettingsGraphicsUploadForm onUpload={onUpload} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
