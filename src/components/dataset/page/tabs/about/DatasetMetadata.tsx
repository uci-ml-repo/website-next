"use client";

import {
  ChevronDownIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  FileChartColumnIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { PapersSelect } from "@/db/types";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DatasetMetadata({ dataset }: { dataset: DatasetResponse }) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  const datasetMetadataContent: { title: string; children: React.ReactNode }[] =
    [
      {
        title: "Introductory Paper",
        children: (
          <>
            {dataset.introductoryPaper ? (
              <PaperPreview paper={dataset.introductoryPaper} />
            ) : (
              blank
            )}
          </>
        ),
      },
      {
        title: "Papers Citing this Dataset",
        children: (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This list may be incomplete
            </div>
            {/*{dataset.citedIn.length > 0*/}
            {/*  ? dataset.citedIn.map((paper) => (*/}
            {/*      <PaperPreview key={paper.id} paper={paper} />*/}
            {/*    ))*/}
            {/*  : blank}*/}
          </div>
        ),
      },
    ];

  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(datasetMetadataContent.length).fill(false),
  );

  const isAnyOpen = openStates.some((state) => state);

  const changeOpenState = (index: number) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <FileChartColumnIcon className="size-6" />
          <h2 className="text-2xl font-bold">Metadata</h2>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setOpenStates([...openStates].fill(!isAnyOpen));
          }}
          className="max-xxs:hidden"
        >
          {isAnyOpen ? (
            <>
              <ChevronsDownUpIcon className="size-6" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronsUpDownIcon className="size-6" />
              Expand All
            </>
          )}
        </Button>
      </div>
      <div>
        <hr />
        {datasetMetadataContent.map((metadata, index) => (
          <div key={index}>
            <MetadataCollapsible
              title={metadata.title}
              isOpen={openStates[index]}
              onOpenChange={() => changeOpenState(index)}
            >
              {metadata.children}
            </MetadataCollapsible>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

function MetadataCollapsible({
  title,
  children,
  isOpen,
  onOpenChange,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <div className="group flex cursor-pointer items-center justify-between space-x-6 px-2 py-6">
          <div className="text-xl font-semibold">{title}</div>
          <div
            className={cn(
              "transition-transform group-hover:scale-125",
              isOpen ? "-rotate-180" : "",
            )}
          >
            <ChevronDownIcon />
          </div>
        </div>
      </CollapsibleTrigger>

      <motion.div
        initial={{ height: 0, paddingBottom: 0 }}
        animate={isOpen ? { height: "fit-content", paddingBottom: 24 } : {}}
        className="overflow-y-hidden px-2"
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </Collapsible>
  );
}

function PaperPreview({ paper }: { paper: PapersSelect }) {
  return (
    <div>
      <Link
        href={`https://www.semanticscholar.org/paper/${paper.semanticScholarId}`}
        target="_blank"
        className="text-lg text-link underline underline-offset-2"
      >
        {paper.title}
      </Link>
      <div>{`${paper.authors.join(", ")}. ${paper.year}.`}</div>
      <div>{paper.venue}</div>
    </div>
  );
}
