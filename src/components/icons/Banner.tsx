import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { HOME_PATH } from "@/globals";
import { cn } from "@/lib/utils";

const logoVariants = cva(cn(), {
  variants: {
    variant: {
      hero: "space-y-1 [&>img]:h-[35px] [&>img]:xs:h-[50px] [&>img]:md:h-[60px] [&>span]:text-[35px] [&>span]:xs:text-[50px] [&>span]:md:text-[60px]",
      logo: "select-none [&>img]:h-[24px] [&>span]:text-nowrap [&>span]:text-[24px]",
    },
  },
  defaultVariants: {
    variant: "hero",
  },
});

interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {}

export function Banner({ variant, className }: LogoProps) {
  const content = (
    <div className={cn(logoVariants({ variant }), className)}>
      <Image
        src={"/img/uc-irvine.svg"}
        alt={"UC Irvine"}
        width={0}
        height={0}
        className={"w-fit"}
        priority={true}
      />
      <span className={"font-semibold leading-none text-uci-blue"}>
        Machine Learning Repository
      </span>
    </div>
  );

  return (
    <>
      {variant === "logo" ? <Link href={HOME_PATH}>{content}</Link> : content}
    </>
  );
}
