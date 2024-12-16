"use client";

import "highlight.js/styles/github-dark.min.css";

import hljs from "highlight.js";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PythonIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Dataset } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DatasetPythonProps {
  dataset: Dataset;
}

const CodeBlock = ({
  code,
  copy,
  language,
}: {
  code: string;
  copy?: boolean;
  language?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef(null);

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className={"relative overflow-hidden rounded-lg"}>
      <pre>
        <code className={cn("text-sm", copy ? "!pr-12" : "", language)}>
          {code}
        </code>
      </pre>
      {copy && (
        <TooltipProvider>
          <Tooltip delayDuration={0} disableHoverableContent>
            <TooltipTrigger
              asChild
              onClick={(event) => event.preventDefault()}
              ref={triggerRef}
            >
              <Button
                variant={"outline"}
                size={"icon"}
                className={"dark absolute right-1.5 top-1.5 text-primary"}
                onClick={copyCode}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              onPointerDownOutside={(event) => {
                if (event.target === triggerRef.current) event.preventDefault();
              }}
            >
              <p>{copied ? "Copied" : "Copy"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default function DatasetPython({ dataset }: DatasetPythonProps) {
  const pipInstallCommand = `pip install ucimlrepo`;

  const pythonCode = `from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
iris = fetch_ucirepo(id=${dataset.id}) 
  
# data (as pandas dataframes) 
X = iris.data.features 
y = iris.data.targets 
  
# metadata 
print(iris.metadata) 
  
# variable information 
print(iris.variables) `;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          pill
          variant={"secondary"}
          className={"lift w-full"}
          size={"lg"}
        >
          <PythonIcon />
          <div>Import Python</div>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Import Python</DialogTitle>
        </DialogHeader>
        <div className={"space-y-4 text-left"}>
          <div className={"space-y-2"}>
            <div>Install the ucimlrepo package</div>
            <CodeBlock
              code={pipInstallCommand}
              language={"language-bash"}
              copy
            />
          </div>
          <div className={"space-y-2"}>
            <div>Import the dataset into your code</div>
            <CodeBlock code={pythonCode} language={"language-python"} copy />
          </div>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={"https://github.com/uci-ml-repo/ucimlrepo"}
              target={"_blank"}
            >
              <div>View Docs</div>
              <ExternalLinkIcon />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
