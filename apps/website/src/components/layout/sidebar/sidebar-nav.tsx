"use client";

import { cn } from "@website/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

export const SidebarNav = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn("flex flex-col", className)} {...props} />
  ),
);
SidebarNav.displayName = "SidebarMenu";

export const SidebarNavLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<"a"> & {
    href: string;
    isActive?: boolean;
    activePath?: RegExp;
  }
>(({ href, isActive: isActiveProp = false, activePath, className, children, ...props }, ref) => {
  const pathname = usePathname();

  const pattern = activePath ?? RegExp(`^${href}$`);

  const isActive = isActiveProp || (pattern?.test(pathname) ?? false);

  return (
    <Link
      ref={ref}
      href={href}
      data-active={isActive}
      className={cn(
        "flex h-12 w-full items-center gap-[1.375rem] p-2 pl-[22px]",
        "text-lg font-semibold",
        "ring-ring outline-none ring-inset focus-visible:ring-2",
        "hover:bg-accent/50 hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[active=true]:bg-accent data-[active=false]:hover:bg-accent/50",
        "[&_*]:text-nowrap [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:stroke-[2.5px]",
        "border-gold data-[active=true]:border-r-4",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
});
SidebarNavLink.displayName = "SidebarMenuButton";
