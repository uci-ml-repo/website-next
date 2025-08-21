"use client";

import type { Session } from "@packages/auth/auth";
import type { DatasetSelect } from "@packages/db/types";
import { SettingsIcon } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes, ReactNode } from "react";

import { useSessionWithInitial } from "@/components/hooks/use-session-with-initial";
import { ROUTES } from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/util/role";

type Props = HTMLAttributes<HTMLElement> & {
  dataset: DatasetSelect;
  session: Session | null;
};

export function DatasetNav({ dataset, session: _session, ...props }: Props) {
  const session = useSessionWithInitial(_session);

  const pathname = usePathname();

  const tabs: { name: ReactNode; path: string; aria?: string }[] = [
    { name: "About", path: ROUTES.DATASET(dataset) },
  ];

  if (!dataset.externalLink) {
    tabs.push({ name: "Files", path: ROUTES.DATASET.FILES(dataset) });
  }

  if (session && (session.user.id === dataset.userId || isPriviliged(session.user.role))) {
    tabs.push({
      name: <SettingsIcon className="size-5.5" />,
      path: ROUTES.DATASET.SETTINGS(dataset),
      aria: "Dataset settings",
    });
  }

  return (
    <nav aria-label="Dataset tabs" {...props}>
      <LayoutGroup>
        <ul className="flex space-x-4">
          {tabs.map(({ name, path, aria }) => {
            const isActive = pathname === path;

            return (
              <li
                key={path}
                className="group relative flex items-center"
                aria-current={isActive ? "page" : undefined}
              >
                <Link href={path} className="p-2 text-lg" aria-label={aria}>
                  {name}
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
