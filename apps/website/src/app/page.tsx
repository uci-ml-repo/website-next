import { SearchIcon } from "lucide-react";
import Link from "next/link";

import { MLRepoLogo } from "@/components/logo/ml-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";

export default function Page() {
  return (
    <div className="space-y-10">
      <MLRepoLogo variant="hero" />
      <div className="blur-background space-y-12">
        <div className="relative">
          <Input
            className="h-12 py-4 pl-11 !text-xl placeholder:text-xl"
            placeholder="Search datasets"
          />
          <SearchIcon className="text-muted-foreground absolute top-3 left-3.5" />
        </div>
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center text-xl font-bold text-pretty">
              Didn't find what you were looking for?
            </h2>
            <Link href={ROUTES.DATASET.SEARCH} className="rounded-full" tabIndex={-1}>
              <Button className="lift" size="lg" variant="gold">
                <SearchIcon />
                Explore All Datasets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
