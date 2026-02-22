import { UserIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { DatasetFull } from "@/server/types/dataset/response";

export function DatasetAboutAdditionalMetadata({ dataset }: { dataset: DatasetFull }) {
  const blank = <span className="text-muted-foreground">&ndash;</span>;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Additional Metadata</h2>
      <Accordion type="multiple" className="w-full" defaultValue={[]}>
        <AccordionItem value="1">
          <AccordionTrigger className="text-lg">Authors</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            {!!dataset.authors.length
              ? dataset.authors.map((author) => (
                  <div key={author.id} className="flex space-x-1">
                    <UserIcon className="fill-foreground size-5" />

                    <div className="space-y-1">
                      <div>
                        {author.firstName} {author.lastName}
                      </div>
                      {author.institution && (
                        <div className="text-muted-foreground text-sm">
                          <span>Institution: </span>
                          {author.institution}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : blank}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionTrigger className="text-lg">Donation Information</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="space-y-1 text-base">
              <div className="space-x-1">
                <span className="font-semibold">Donated By:</span>
                <span>{dataset.user.name}</span>
              </div>

              <div className="space-x-1">
                <span className="font-semibold">Donated On:</span>
                <span>
                  {dataset.donatedAt.toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
