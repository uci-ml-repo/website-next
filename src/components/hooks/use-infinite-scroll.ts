import { useCallback, useEffect, useRef } from "react";

type UseInfiniteScrollProps = {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  rootMargin?: string;
};

export function useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  rootMargin = "100px",
}: UseInfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const triggerFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin },
    );

    const currentElement = loadMoreRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin]);

  return {
    loadMoreRef,
    triggerFetchNextPage,
  };
}
