"use client";

import "highlight.js/styles/github-dark.min.css";

import { BookMarkedIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Copy } from "@/components/ui/copy";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Enums } from "@/db/lib/enums";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetCitationButtonProps {
  dataset: DatasetResponse;
}

export function DatasetCitationButton({ dataset }: DatasetCitationButtonProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [citationOption, setCitationOption] = useState<string>("apa");
  const [citationText, setCitationText] = useState<string>("");

  const { data: citations } = trpc.dataset.cite.byId.useQuery(dataset.id, {
    enabled: dialogOpen,
  });

  type CitationOption = keyof NonNullable<typeof citations>;

  useEffect(() => {
    if (citations) {
      setCitationText(citations[citationOption as CitationOption]);
    }
  }, [citationOption, citations]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="lift w-full"
          size="lg"
          aria-label={`Cite ${dataset.title}`}
        >
          <BookMarkedIcon />
          <div>Cite</div>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Cite Dataset</DialogTitle>
        </DialogHeader>
        <div className="-m-1 space-y-4 overflow-hidden p-1">
          <div className="relative min-h-11 overflow-x-auto rounded-lg bg-muted p-2">
            {citations ? (
              <>
                <pre className="whitespace-pre-wrap pr-12 text-sm">
                  {citationText}
                </pre>
                <Copy text={citationText} />
              </>
            ) : (
              <div className="flex h-16 w-full items-center justify-center">
                <Spinner className="size-6" />
              </div>
            )}
          </div>

          {dataset.status === Enums.ApprovalStatus.DRAFT && (
            <Alert variant="blue">
              <div className="flex items-center space-x-1">
                <InfoIcon className="size-5" />
                <span>To populate citation data, add dataset metadata.</span>
              </div>
            </Alert>
          )}

          <div className="flex items-center space-x-2">
            <div>Style:</div>
            <Select value={citationOption} onValueChange={setCitationOption}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apa">APA</SelectItem>
                  <SelectItem value="mla">MLA</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="vancouver">Vancouver</SelectItem>
                  <SelectItem value="ieee">IEEE</SelectItem>
                  <SelectItem value="bibtex">BibTeX</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
