import { UserIcon } from "lucide-react";
import React from "react";

import type { AuthorSelect } from "@/db/lib/types";

interface AuthorsSectionProps {
  authors: AuthorSelect[];
}

export function DatasetMetadataAuthors({ authors }: AuthorsSectionProps) {
  const blank = <span className="text-muted-foreground">&ndash;</span>;

  return (
    <div className="space-y-4">
      {!!authors.length ? (
        authors.map((author) => (
          <div key={author.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              <UserIcon className="size-5 fill-foreground" />
              <div>
                {author.firstName} {author.lastName}
              </div>
            </div>
            <div className="ml-7">
              <div className="text-sm text-muted-foreground">
                <span>Email: </span>
                {author.email ? (
                  <a
                    href={`mailto:${author.email}`}
                    className="hover:underline"
                  >
                    {author.email}
                  </a>
                ) : (
                  blank
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <span>Institution: </span>
                {author.institution ? author.institution : blank}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground">&ndash;</div>
      )}
    </div>
  );
}
