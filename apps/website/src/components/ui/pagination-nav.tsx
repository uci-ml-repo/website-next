"use client";

import { uniq } from "lodash";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/util/cn";

interface Props {
  totalCount: number;
  limit: number;
  cursor: number;
  onLimitChange: (newLimit: number) => void;
  perPageOptions?: number[];
}

export function PaginationNav({
  totalCount,
  limit,
  cursor,
  onLimitChange,
  perPageOptions = [10, 25, 50, 100],
}: Props) {
  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());

  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.floor(cursor / limit) + 1;

  const pageButtons = uniq(
    [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
      (n) => n >= 1 && n <= totalPages,
    ),
  );

  const pageHref = (page: number) => {
    const newParams = { ...paramsObject, cursor: ((page - 1) * limit).toString() };
    const searchParams = new URLSearchParams(newParams);
    return `?${searchParams.toString()}`;
  };

  return (
    <div className="@container flex items-center justify-between gap-x-8 gap-y-4 max-md:flex-col-reverse">
      {totalCount > Math.min(...perPageOptions) ? (
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground text-sm text-nowrap">Per page</div>

          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              onLimitChange(Number(value));
            }}
          >
            <SelectTrigger size="sm">
              {perPageOptions.includes(limit) ? (
                <SelectValue />
              ) : (
                <div>{limit.toLocaleString()}</div>
              )}
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-x-2 gap-y-4 max-md:flex-col-reverse">
        <div className="text-muted-foreground text-sm text-nowrap @max-2xl:hidden">
          {cursor} &ndash; {Math.min(totalCount, cursor + limit)} of {totalCount}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage === 1 ? "#" : pageHref(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {pageButtons.map((page, i) => (
              <Fragment key={page}>
                {i !== 0 && pageButtons[i - 1] !== page - 1 && <PaginationEllipsis />}
                <PaginationItem
                  className={cn({ "max-xs:hidden": Math.abs(page - currentPage) === 1 })}
                >
                  <PaginationLink href={pageHref(page)} isActive={page === currentPage}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            ))}
            <PaginationItem>
              <PaginationNext
                href={currentPage === totalPages ? "#" : pageHref(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
