import { ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { FaPython } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DatasetFull } from "@/server/types/dataset/response";

type Props = ComponentProps<typeof Button> & {
  dataset: DatasetFull;
};

export function DatasetPythonButton({ dataset, ...props }: Props) {
  if (!dataset.isAvailablePython) throw new Error();

  const install = `pip install ucimlrepo`;
  const code = pythonCode(dataset);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          aria-label={`Import ${dataset.title} in Python`}
          variant="secondary"
          {...props}
        >
          <FaPython />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Import dataset in Python</DialogTitle>
        </DialogHeader>
        <div className="min-w-0 space-y-2">
          <div>Install the ucimlrepo package</div>
          <CodeBlock code={install} language="language-bash" />
        </div>
        <div className="min-w-0 space-y-2">
          <div>Import the dataset into your code</div>
          <CodeBlock code={code} language="language-python" />
        </div>
        <Button variant="secondary" size="xs" className="w-fit" asChild>
          <a
            href="https://github.com/uci-ml-repo/ucimlrepo"
            target="_blank"
            className="underline-offset-1 hover:underline focus-visible:underline"
            rel="noreferrer"
          >
            View Docs
            <ExternalLinkIcon />
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function pythonCode({ id, slug }: { id: number; slug: string }) {
  let variableName = slug.replace(/[^a-zA-Z0-9]/g, "_");
  variableName = variableName.substring(0, variableName.indexOf("_", 25)) || variableName;

  return `from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
${variableName} = fetch_ucirepo(id=${id}) 
  
# data (as pandas dataframes) 
x = ${variableName}.data.features 
y = ${variableName}.data.targets 
  
# metadata 
print(${variableName}.metadata) 
  
# variable information 
print(${variableName}.variables) `;
}
