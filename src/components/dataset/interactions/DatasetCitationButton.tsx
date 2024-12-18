"use client";

import "highlight.js/styles/github-dark.min.css";

import type { Dataset } from "@prisma/client";
import { BookMarkedIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DatasetCitationButtonProps {
  dataset: Dataset;
}

export default function DatasetCitationButton({
  dataset,
}: DatasetCitationButtonProps) {
  console.log(dataset);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          pill
          variant={"secondary"}
          className={"lift w-full"}
          size={"lg"}
        >
          <BookMarkedIcon />
          <div>Cite</div>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Cite Dataset</DialogTitle>
        </DialogHeader>
        <div>TODO</div>
      </DialogContent>
    </Dialog>
  );
}
