import {
  ArrowDownAZIcon,
  ClockIcon,
  Columns3Icon,
  FilterIcon,
  Rows3Icon,
  TrendingUpIcon,
} from "lucide-react";
import type { Metadata } from "next";

import Main from "@/components/layout/Main";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
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
            <SheetTrigger asChild>
              <Button variant="blue">
                <FilterIcon />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80dvh]">
              <SheetTitle>Filters</SheetTitle>
            </SheetContent>
          </Sheet>
          <div className="gradient-blur space-y-1">
            <div>Sort By</div>
            <Select>
              <SelectTrigger className="w-48 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">
                  <TrendingUpIcon />
                  <span>Top</span>
                </SelectItem>
                <SelectItem value="new">
                  <ClockIcon />
                  <span>New</span>
                </SelectItem>
                <SelectItem value="blueberry">
                  <Rows3Icon />
                  <span>Most Instances</span>
                </SelectItem>
                <SelectItem value="grapes">
                  <Columns3Icon />
                  <span>Most Features</span>
                </SelectItem>
                <SelectItem value="pineapple">
                  <ArrowDownAZIcon />
                  <span>Name</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Main>
  );
}
