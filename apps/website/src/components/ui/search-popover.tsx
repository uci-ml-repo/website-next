import { CommandEmpty } from "cmdk";
import type { ComponentProps, ReactNode } from "react";
import { useRef, useState } from "react";

import { Command, CommandList } from "@/components/ui/command";
import { SearchInput } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/util/cn";

type Props = ComponentProps<typeof SearchInput> & {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  loading?: ReactNode;
  empty?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
};

export function SearchPopover({
  placeholder,
  loading,
  empty,
  children,
  size,
  contentClassName,
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  return (
    <div ref={containerRef}>
      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
          <SearchInput
            placeholder={placeholder}
            size={size}
            onClick={() => setSearchOpen(true)}
            onInput={() => setSearchOpen(true)}
            onBlur={(e) => {
              if (!containerRef.current?.contains(e.relatedTarget)) setSearchOpen(false);
            }}
            {...props}
          />
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn("overflow-hidden p-0", contentClassName)}
          avoidCollisions={false}
          portal={false}
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          {loading || (
            <Command>
              <CommandList>
                <CommandEmpty>{empty ?? "No results found"}</CommandEmpty>
                {children}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
