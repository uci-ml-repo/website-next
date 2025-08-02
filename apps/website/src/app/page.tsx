import { MLRepoLogo } from "@components/logo/ml-repo";
import { Input } from "@components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-10">
      <MLRepoLogo variant="hero" />
      <div className="blur-background">
        <div className="relative">
          <Input
            className="h-12 py-4 pl-11 !text-xl placeholder:text-xl"
            placeholder="Search datasets"
          />
          <SearchIcon className="text-muted-foreground absolute top-3 left-3.5" />
        </div>
      </div>
    </div>
  );
}
