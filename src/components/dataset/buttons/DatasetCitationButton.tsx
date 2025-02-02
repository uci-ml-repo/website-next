"use client";

import "highlight.js/styles/github-dark.min.css";

import { BookMarkedIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Copy from "@/components/ui/copy";
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
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetCitationButtonProps {
  dataset: DatasetResponse;
}

export default function DatasetCitationButton({
  dataset,
}: DatasetCitationButtonProps) {
  const citationsQuery = trpc.dataset.cite.byId.useQuery(dataset.id);
  const citations = citationsQuery.data;

  type CitationOption = keyof NonNullable<typeof citations>;

  const [citationOption, setCitationOption] = useState<string>("apa");
  const [citationText, setCitationText] = useState<string>("");

  useEffect(() => {
    if (citations) {
      setCitationText(citations[citationOption as CitationOption]);
    }
  }, [citationOption, citations]);

  return (
    <Dialog>
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
        {citations && (
          <div className="-m-1 space-y-4 overflow-hidden p-1">
            <div className="relative overflow-x-auto rounded-lg bg-muted p-2">
              <pre className="whitespace-pre-wrap pr-12 text-sm">
                {citationText}
              </pre>
              <Copy text={citationText} />
            </div>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
