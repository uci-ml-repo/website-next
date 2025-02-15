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

export function SmartPagination({
  totalCount,
  limit,
  offset,
  onPageChange,
}: {
  totalCount: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
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
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(offset - limit, 0))}
            disabled={offset === 0}
          />
        </PaginationItem>

        {paginationItems.map((item, index) => {
          if (typeof item === "number") {
            return (
              <PaginationItem key={index} className="cursor-pointer">
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

        <PaginationItem className="cursor-pointer">
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
