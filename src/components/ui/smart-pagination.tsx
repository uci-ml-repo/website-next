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

const perPageOptions = [10, 25, 50, 100];

export function SmartPagination({
  totalCount,
  limit,
  offset,
  onPageChange,
  onLimitChange, // new prop for changing the page limit
}: {
  totalCount: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  onLimitChange: (newLimit: number) => void;
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
    <Pagination className="justify-end space-x-2">
      <div className="flex items-center space-x-2">
        <div className="text-sm text-nowrap text-muted-foreground">
          Results Per Page
        </div>

        <Select
          value={limit.toString()} // use the current limit as the value
          onValueChange={(value) => {
            // update the limit and reset offset to 0
            onLimitChange(Number(value));
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((option) => (
              <SelectItem
                key={option}
                className="cursor-pointer"
                value={option.toString()}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
    </Pagination>
  );
}
