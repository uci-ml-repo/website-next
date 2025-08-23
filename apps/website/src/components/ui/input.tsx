import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { CircleXIcon, SearchIcon } from "lucide-react";
import type { ChangeEvent, ComponentProps, HTMLAttributes } from "react";
import { useCallback } from "react";

import { cn } from "@/lib/util/cn";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input flex h-9 w-full min-w-0 rounded-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

const searchInputVariants = cva(
  cn(
    "relative",
    "[&_svg]:text-muted-foreground [&_svg]:absolute [&_svg]:top-1/4 [&_svg:not([class*='size-'])]:h-1/2",
  ),
  {
    variants: {
      size: {
        sm: cn(
          "[&_input]:h-8 [&_input]:px-8 [&_input]:py-1 [&_input]:!text-sm [&_input]:placeholder:text-sm",
          "[&_svg[data-icon=clear]]:right-1.5 [&_svg[data-icon=search]]:left-1.5",
        ),
        md: cn(
          "[&_input]:h-10 [&_input]:px-10 [&_input]:py-1.5 [&_input]:!text-base [&_input]:placeholder:text-base",
          "[&_svg[data-icon=clear]]:right-3 [&_svg[data-icon=search]]:left-3",
        ),
        lg: cn(
          "[&_input]:h-12 [&_input]:px-11 [&_input]:py-4 [&_input]:!text-xl [&_input]:placeholder:text-xl",
          "[&_svg[data-icon=clear]]:right-3.5 [&_svg[data-icon=search]]:left-3.5",
        ),
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type Props = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof searchInputVariants> & {
    value: string | undefined;
    setValue: (value: string) => void;
    placeholder?: string;
    inputProps?: ComponentProps<typeof Input>;
    onClear?: () => void;
    alwaysShowClear?: boolean;
  };

function SearchInput({
  className,
  placeholder,
  size,
  value,
  setValue,
  inputProps,
  onClear,
  alwaysShowClear,
  ...props
}: Props) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [setValue],
  );

  return (
    <div className={cn(searchInputVariants({ size }), className)} {...props}>
      <Input placeholder={placeholder} value={value} onChange={handleChange} {...inputProps} />
      <SearchIcon data-icon="search" />
      {(alwaysShowClear || value) && (
        <CircleXIcon
          data-icon="clear"
          className="hover:text-muted-foreground/75 cursor-pointer transition-colors"
          onClick={(e) => {
            setValue("");
            onClear?.();
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Clear search"
          role="button"
        />
      )}
    </div>
  );
}

export { Input, SearchInput };
