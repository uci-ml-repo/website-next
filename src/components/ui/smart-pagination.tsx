import React from "react";

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
import { cn } from "@/lib/utils";

export function SmartPagination({
  totalCount,
  limit,
  offset,
  onPageChange,
  onLimitChange,
  perPageOptions = [10, 25, 50, 100],
}: {
  totalCount: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  onLimitChange: (newLimit: number) => void;
  perPageOptions?: number[];
}) {
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const paginationItems = [];

  paginationItems.push(1);

  if (currentPage - 1 > 1) {
    if (currentPage - 1 === 2) {
      paginationItems.push(2);
    } else {
      paginationItems.push("ellipsis-left");
      paginationItems.push(currentPage - 1);
    }
  }

  if (currentPage !== 1 && currentPage !== totalPages) {
    paginationItems.push(currentPage);
  }

  if (currentPage + 1 < totalPages) {
    if (currentPage + 1 === totalPages - 1) {
      paginationItems.push(totalPages - 1);
    } else {
      paginationItems.push(currentPage + 1);
      paginationItems.push("ellipsis-right");
    }
  }

  if (totalPages > 1) {
    paginationItems.push(totalPages);
  }

  const handlePageChange = (pageNumber: number) => {
    onPageChange((pageNumber - 1) * limit);
  };

  return (
    <Pagination className="flex justify-between gap-x-2 gap-y-4 max-md:flex-col-reverse">
      {totalCount > Math.min(...perPageOptions) ? (
        <div className="flex items-center space-x-2">
          <div className="text-nowrap text-sm text-muted-foreground">
            Results per page
          </div>

          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              onLimitChange(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-fit">
              {perPageOptions.includes(limit) ? (
                <SelectValue />
              ) : (
                <div>{limit.toLocaleString()}</div>
              )}
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem
                  key={option}
                  className="cursor-pointer"
                  value={option.toString()}
                >
                  {option.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-2 max-md:flex-col-reverse">
        <div className="mr-2 text-nowrap text-sm text-muted-foreground">
          {offset} &ndash; {Math.min(totalCount, offset + limit)} of{" "}
          {totalCount}
        </div>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(offset - limit, 0))}
              disabled={offset === 0}
            />
          </PaginationItem>

          {paginationItems.map((item, index) => {
            if (typeof item === "number") {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(item)}
                    isActive={item === currentPage}
                    className={cn({ "text-xs": totalPages >= 100 })}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            } else {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                onPageChange(Math.min(offset + limit, (totalPages - 1) * limit))
              }
              disabled={offset + limit >= totalCount}
            />
          </PaginationItem>
        </PaginationContent>
      </div>
    </Pagination>
  );
}
