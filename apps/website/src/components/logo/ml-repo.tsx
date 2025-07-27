import { ROUTES } from "@lib/routes";
import { cn } from "@lib/util/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import React from "react";

const logoVariants = cva("w-fit", {
  variants: {
    variant: {
      hero: "text-[30px] sm:text-[45px] md:text-[55px]",
      logo: "space-y-0.5 text-[24px] text-nowrap select-none",
      "logo-sm": "space-y-0.5 text-[18px] text-nowrap select-none",
    },
    textColor: {
      default: "[&>[data-line='1']]:text-primary [&>[data-line='2']]:text-blue",
      mono: "text-primary",
      "blue-foreground": "text-blue-foreground",
    },
  },
  defaultVariants: {
    variant: "hero",
    textColor: "default",
  },
});

interface LogoProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof logoVariants> {
  href?: string | boolean;
  abbreviate?: boolean;
}

const montserrat = Montserrat({ subsets: ["latin"] });

export function MLRepoLogo({
  variant,
  textColor,
  className,
  href,
  abbreviate,
  ...props
}: LogoProps) {
  const content = (
    <div className={cn(logoVariants({ variant, textColor }), className)} {...props}>
      <div data-line="1" className={cn(montserrat.className, "leading-[0.9] font-extrabold")}>
        UC Irvine
      </div>
      <div data-line="2" className="leading-none font-bold">
        {abbreviate ? "ML Repository" : "Machine Learning Repository"}
      </div>
    </div>
  );

  return href ? <Link href={href === true ? ROUTES.HOME : href}>{content}</Link> : content;
}
