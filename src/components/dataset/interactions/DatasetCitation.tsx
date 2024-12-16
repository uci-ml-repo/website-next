// TODO

import type { Dataset } from "@prisma/client";
import { BookMarkedIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DatasetCitationProps {
  dataset: Dataset;
}

export default function DatasetCitation({ dataset }: DatasetCitationProps) {
  console.log(dataset);

  return (
    <Button pill variant={"secondary"} className={"lift w-full"} size={"lg"}>
      <BookMarkedIcon />
      <div>Cite Dataset</div>
    </Button>
  );
}
