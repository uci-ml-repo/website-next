import { CommandEmpty } from "cmdk";
import { Loader2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useRef, useState } from "react";

import { Command, CommandList } from "@/components/ui/command";
import { SearchInput } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = Pick<ComponentProps<typeof SearchInput>, "size"> & {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  empty?: ReactNode;
  children?: ReactNode;
};

export function SearchPopover({
  placeholder,
  searchValue,
  setSearchValue,
  isLoading,
  empty,
  children,
  size,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  return (
    <div ref={containerRef}>
      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
          <SearchInput
            setValue={setSearchValue}
            value={searchValue}
            placeholder={placeholder}
            size={size}
            className="rounded-lg"
            wrapperClassName="bg-background rounded-lg"
            onClick={() => setSearchOpen(true)}
            onInput={() => setSearchOpen(true)}
            onBlur={(e) => {
              if (!containerRef.current?.contains(e.relatedTarget)) setSearchOpen(false);
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-68 p-0"
          avoidCollisions={false}
          portal={false}
        >
          {isLoading ? (
            <div className="flex h-10 items-center justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <Command className="overflow-visible">
              <CommandList className="overflow-visible">
                <CommandEmpty className="text-muted-foreground flex h-10 items-center justify-center">
                  {empty ?? "No results found"}
                </CommandEmpty>
                {children}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
