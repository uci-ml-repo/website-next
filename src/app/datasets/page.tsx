import { FilterIcon } from "lucide-react";
import type { Metadata } from "next";

import Main from "@/components/layout/Main";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main>
      <div className="flex">
        <div className="w-80 max-md:hidden">Filters</div>
        <div className="flex w-full items-center justify-between">
          <div>Search</div>
          <Sheet>
            <SheetTrigger>
              <Button variant="blue">
                <FilterIcon />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80dvh]">
              <SheetTitle>Filters</SheetTitle>
            </SheetContent>
          </Sheet>
          <div>
            <div>Sort By</div>
            <Select>
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
      </div>
    </Main>
  );
}
