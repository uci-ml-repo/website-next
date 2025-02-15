import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"button">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: isActive ? "blue" : "ghost",
        pill: true,
        size,
      }),
      {
        "cursor-default text-muted-foreground hover:bg-background hover:text-muted-foreground":
          disabled,
      },
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  showText,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { showText?: boolean }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size={showText ? "default" : "icon"}
    className={cn({ "gap-1 pl-2.5": showText }, className)}
    {...props}
  >
    <ChevronLeft className="size-4" />
    {showText && <span>Previous</span>}
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  showText,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { showText?: boolean }) => (
  <PaginationLink
    aria-label="Go to next page"
    size={showText ? "default" : "icon"}
    className={cn({ "gap-1 pl-2.5": showText }, className)}
    {...props}
  >
    {showText && <span>Next</span>}
    <ChevronRight className="size-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
