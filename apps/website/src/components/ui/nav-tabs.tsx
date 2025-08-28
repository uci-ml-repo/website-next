"use client";

import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes, ReactNode } from "react";

export type NavTab = {
  display: ReactNode;
  path: string;
};

type Props = HTMLAttributes<HTMLElement> & {
  tabs: NavTab[];
};

export function NavTabs({ tabs, ...props }: Props) {
  const pathname = usePathname();

  return (
    <nav className="border-b" {...props}>
      <LayoutGroup>
        <ul className="flex space-x-4">
          {tabs.map(({ display, path }) => {
            const isActive = pathname === path;

            return (
              <li
                key={path}
                className="group relative flex items-center"
                aria-current={isActive ? "page" : undefined}
              >
                <Link href={path} className="focus-visible:bg-accent p-2 text-lg -outline-offset-2">
                  {display}
                </Link>
                {isActive && (
                  <motion.div
                    layoutId="tab-underline"
                    className="bg-foreground absolute right-0 -bottom-px left-0 h-[3px] rounded-t-full"
                    transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
                  />
                )}
                <div className="bg-foreground/25 animate-in fade-in absolute right-0 -bottom-px left-0 h-[3px] rounded-t-full backdrop-blur not-group-hover:hidden" />
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
