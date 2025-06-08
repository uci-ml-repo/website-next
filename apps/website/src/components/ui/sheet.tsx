import { Close, Content, Overlay, Portal, Root, Title } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSidebar } from "@website/components/layout/sidebar/sidebar-provider";
import { Button } from "@website/components/ui/button";
import { cn } from "@website/lib/utils/cn";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { MenuIcon, XIcon } from "lucide-react";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

export const Sheet = Root;

export const SheetTitle = Title;

export const SheetOverlay = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof Overlay>>(
  ({ className, ...props }, ref) => (
    <Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/20",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
);
SheetOverlay.displayName = Overlay.displayName;

const SidebarTrigger = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("m-2 size-12 shrink-0", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        aria-label="Toggle sidebar"
        {...props}
      >
        <MenuIcon className="!size-6" />
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const sheetVariants = cva(
  cn(
    "bg-background fixed z-50 gap-4 p-6 shadow-lg",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "transition duration-300 ease-out",
  ),
  {
    variants: {
      side: {
        top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b",
        bottom:
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t",
        left: "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full border-r sm:max-w-sm",
        right:
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof Content>,
    VariantProps<typeof sheetVariants> {
  closeButton?: boolean;
}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side, className, children, closeButton = true, ...props }, ref) => (
    <Portal>
      <SheetOverlay />
      <Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {closeButton && (
          <Close
            className={cn(
              "ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity",
              "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
              "data-[state=open]:bg-secondary hover:opacity-100 disabled:pointer-events-none",
            )}
          >
            <XIcon className="size-4" />
            <VisuallyHidden>Close</VisuallyHidden>
          </Close>
        )}
        {children}
      </Content>
    </Portal>
  ),
);
SheetContent.displayName = Content.displayName;
