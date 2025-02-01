import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import React from "react";

import { UCIrvine } from "@/components/icons";
import { HOME_ROUTE } from "@/lib/routes";
import { cn } from "@/lib/utils";

const logoVariants = cva(cn(), {
  variants: {
    variant: {
      hero: "[&>div]:text-[35px] [&>div]:xs:text-[50px] [&>div]:md:text-[60px] [&>svg]:h-[35px] [&>svg]:xs:h-[50px] [&>svg]:md:h-[60px]",
      logo: "select-none space-y-0.5 [&>div]:text-[24px] [&>svg]:h-[24px]",
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
}

export function Banner({ variant, textColor, className, link }: LogoProps) {
  const content = (
    <div className={cn(logoVariants({ variant, textColor }), className)}>
      <UCIrvine />
      <div className="font-semibold leading-none text-uci-blue">
        Machine Learning Repository
      </div>
    </div>
  );

  return <>{link ? <Link href={HOME_ROUTE}>{content}</Link> : content}</>;
}
