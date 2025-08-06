"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ComponentProps, HTMLAttributes, KeyboardEvent } from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/cn";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  gutter,
  ...props
}: ComponentProps<"div"> & {
  gutter?: boolean;
}) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className={cn("overflow-hidden", {
        "-m-4 -mb-6 mask-x-from-[calc(100%-1rem)] mask-x-to-100% p-4 pb-6": gutter,
      })}
      data-slot="carousel-content "
    >
      <div
        className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

const CarouselScrollDots = ({
  api,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  api: CarouselApi;
}) => {
  const [slideNodes, setSlideNodes] = useState<HTMLElement[]>([]);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const minSlide = slidesInView[0];
  const maxSlide = slidesInView[slidesInView.length - 1];

  useEffect(() => {
    if (!api) return;

    api.on("init", () => {
      setSlideNodes(api.slideNodes());
      setSlidesInView(api.slidesInView());
    });

    api.on("slidesChanged", () => {
      setSlideNodes(api.slideNodes());
      setSlidesInView(api.slidesInView());
    });

    api.on("slidesInView", () => {
      setSlidesInView(api.slidesInView());
    });
  }, [api]);

  const SHOW_NODES_SIDES = 3;

  return (
    <div className={cn("flex h-4 items-end justify-center", className)} {...props}>
      {!!slidesInView.length && (
        <div className="animate-in fade-in-0 flex items-center justify-center space-x-1 transition-opacity">
          {slideNodes.map((_, index) => {
            if (index < minSlide - SHOW_NODES_SIDES || index > maxSlide + SHOW_NODES_SIDES) {
              return null;
            }

            return (
              <div
                key={index}
                data-state={
                  index >= minSlide && index <= maxSlide
                    ? "active"
                    : index === minSlide - SHOW_NODES_SIDES || index === maxSlide + SHOW_NODES_SIDES
                      ? "edge"
                      : "inactive"
                }
                className={cn(
                  "rounded-full transition-all",
                  "data-[state=active]:h-2 data-[state=active]:w-4 data-[state=edge]:h-1.5 data-[state=edge]:w-1.5 data-[state=inactive]:h-2 data-[state=inactive]:w-2",
                  "data-[state=active]:bg-secondary-foreground/50 data-[state=edge]:bg-secondary-foreground/10 data-[state=inactive]:bg-secondary-foreground/20",
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselScrollDots,
};
