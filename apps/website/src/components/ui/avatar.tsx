import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import { cn } from "@website/lib/utils/cn";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";

export const Avatar = forwardRef<ComponentRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, ...props }, ref) => (
    <Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  ),
);
Avatar.displayName = Root.displayName;

export const AvatarImage = forwardRef<
  ComponentRef<typeof Image>,
  ComponentPropsWithoutRef<typeof Image>
>(({ className, alt, ...props }, ref) => (
  <Image
    ref={ref}
    className={cn("aspect-square size-full", className)}
    fetchPriority="high"
    alt={alt}
    {...props}
  />
));
AvatarImage.displayName = Image.displayName;

const AvatarFallback = forwardRef<
  ComponentRef<typeof Fallback>,
  ComponentPropsWithoutRef<typeof Fallback>
>(({ className, ...props }, ref) => (
  <Fallback
    ref={ref}
    className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
    delayMs={200}
    {...props}
  />
));
AvatarFallback.displayName = Fallback.displayName;
