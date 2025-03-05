"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  slidesInView: number[];
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [slidesInView, setSlidesInView] = React.useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    useEffect(() => {
      if (!api) {
        return;
      }

      setSlidesInView(api.slidesInView());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, [api]);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setSlidesInView(api.slidesInView());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
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

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

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
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          slidesInView,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { gutter?: boolean }
>(({ className, gutter, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <>
      {gutter && (
        <div className="absolute -left-3 bottom-0 top-0 z-10 w-3 bg-gradient-to-r from-background" />
      )}
      <div
        ref={carouselRef}
        className={cn("overflow-hidden", gutter ? "-m-3 -mb-6 p-3 pb-6" : "")}
      >
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className,
          )}
          {...props}
        />
      </div>
      {gutter && (
        <div className="absolute -right-3 bottom-0 top-0 z-10 w-3 bg-gradient-to-l from-background" />
      )}
    </>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { staticPositioning?: boolean }
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      staticPositioning,
      ...props
    },
    ref,
  ) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "size-9 rounded-full",
          !staticPositioning && "absolute",
          !staticPositioning &&
            (orientation === "horizontal"
              ? "-left-12 top-1/2 -translate-y-1/2"
              : "-top-12 left-1/2 -translate-x-1/2 rotate-90"),
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { staticPositioning?: boolean }
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      staticPositioning,
      ...props
    },
    ref,
  ) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "size-9 rounded-full",
          !staticPositioning && "absolute",
          !staticPositioning &&
            (orientation === "horizontal"
              ? "-right-12 top-1/2 -translate-y-1/2"
              : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"),
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="size-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";
const CarouselScrollDots = ({ api }: { api: CarouselApi }) => {
  const [slideNodes, setSlideNodes] = useState<HTMLElement[]>([]);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const minSlide = slidesInView[0];
  const maxSlide = slidesInView[slidesInView.length - 1];

  useEffect(() => {
    if (!api) return;

    setSlideNodes(api.slideNodes());
    setSlidesInView(api.slidesInView());

    api.on("init", () => {
      setSlideNodes(api.slideNodes());
      setSlidesInView(api.slidesInView());
    });

    api.on("slidesInView", () => {
      setSlidesInView(api.slidesInView());
    });
  }, [api]);

  const SHOW_NODES_SIDES = 3;

  return (
    <div className="flex h-4 items-end justify-center">
      {!!slidesInView.length && (
        <div className="flex items-center justify-center space-x-1 transition-opacity animate-in fade-in-0">
          {slideNodes.map((_, index) => {
            if (
              index < minSlide - SHOW_NODES_SIDES ||
              index > maxSlide + SHOW_NODES_SIDES
            ) {
              return null;
            }

            let state = "inactive";
            if (index >= minSlide && index <= maxSlide) {
              state = "active";
            } else if (
              index === minSlide - SHOW_NODES_SIDES ||
              index === maxSlide + SHOW_NODES_SIDES
            ) {
              state = "edge";
            }

            return (
              <div
                key={index}
                data-state={state}
                className={cn(
                  "rounded-full transition-all",
                  "data-[state=active]:h-2 data-[state=edge]:h-1.5 data-[state=inactive]:h-2 data-[state=active]:w-4 data-[state=edge]:w-1.5 data-[state=inactive]:w-2",
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
