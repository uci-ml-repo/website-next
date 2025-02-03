import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import React from "react";

import { UCIrvine } from "@/components/icons";
import { HOME_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

const logoVariants = cva(cn(), {
  variants: {
    variant: {
      hero: "[&>div]:text-[30px] [&>div]:xs:text-[45px] [&>div]:md:text-[55px] [&>svg]:h-[30px] [&>svg]:xs:h-[45px] [&>svg]:md:h-[55px]",
      logo: "select-none space-y-0.5 [&>div]:text-[24px] [&>svg]:h-[24px]",
      "logo-sm": "select-none space-y-0.5 [&>div]:text-[18px] [&>svg]:h-[18px]",
    },
    textColor: {
      default: "[&>div]:text-uci-blue [&>svg]:fill-primary",
      mono: "[&>div]:text-primary [&>svg]:fill-primary",
      monoForeground:
        "[&>div]:text-primary-foreground [&>svg]:fill-primary-foreground",
      monoUciBlueForeground:
        "[&>div]:text-uci-blue-foreground [&>svg]:fill-uci-blue-foreground",
    },
  },
  defaultVariants: {
    variant: "hero",
    textColor: "default",
  },
});

interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
  link?: boolean;
  abbreviate?: boolean;
}

export function Banner({
  variant,
  textColor,
  className,
  link,
  abbreviate,
}: LogoProps) {
  const content = (
    <div className={cn(logoVariants({ variant, textColor }), className)}>
      <UCIrvine aria-label="UC Irvine" />
      <div className="font-bold leading-none text-uci-blue">
        {abbreviate ? "ML Repository" : "Machine Learning Repository"}
      </div>
    </div>
  );

  return <>{link ? <Link href={HOME_ROUTE}>{content}</Link> : content}</>;
}
