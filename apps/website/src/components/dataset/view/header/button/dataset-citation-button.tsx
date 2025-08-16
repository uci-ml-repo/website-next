"use client";

import { BookMarkedIcon } from "lucide-react";
import { useState } from "react";

import { Citation } from "@/components/dataset/view/header/button/dataset-citation";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatasetFull } from "@/server/types/dataset/response";

export function DatasetCitationButton({ dataset }: { dataset: DatasetFull }) {
  const citations = new Citation(dataset).allCitations();
  type CitationOption = keyof typeof citations;

  const citationOptions: Record<CitationOption, string> = {
    apa: "APA",
    mla: "MLA",
    chicago: "Chicago",
    vancouver: "Vancouver",
    ieee: "IEEE",
    bibtex: "BibTeX",
  };

  const [citationOption, setCitationOption] = useState<CitationOption>("apa");

  const citationText = citations[citationOption];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary">
          <BookMarkedIcon />
          Cite
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Cite Dataset</DialogTitle>
        </DialogHeader>
        {dataset.citation ? (
          <>
            <div className="space-y-1">
              <div className="text-muted-foreground">Citation information:</div>
              <CitationBlock text={dataset.citation} />
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">UCI ML Repository citation:</div>
              <CitationBlock text={citationText} />
            </div>
          </>
        ) : (
          <CitationBlock text={citationText} />
        )}
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground">Style:</div>
          <Select
            value={citationOption}
            onValueChange={(option) => setCitationOption(option as CitationOption)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(citationOptions).map(([key, displayName]) => (
                <SelectItem key={key} value={key}>
                  {displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const CitationBlock = ({ text }: { text: string }) => (
  <div className="bg-muted relative min-h-11 overflow-x-auto rounded-lg p-2">
    <pre className="pr-10 text-sm whitespace-pre-wrap">{text}</pre>
    <CopyButton copyText={text} className="absolute top-1.5 right-1.5" />
  </div>
);
