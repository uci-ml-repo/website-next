"use client";

import type { Session } from "@packages/auth/auth";
import type { DatasetSelect } from "@packages/db/types";
import { SettingsIcon } from "lucide-react";
import { LayoutGroup } from "motion/react";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";

interface Props {
  dataset: DatasetSelect;
  session: Session | null;
}

export function DatasetNav({ dataset, session: _session }: Props) {
  const tabs = [
    { name: "About", href: ROUTES.DATASET(dataset) },
    ...(dataset.externalLink ? [] : [{ name: "Files", href: ROUTES.DATASET.FILES(dataset) }]),
    { name: <SettingsIcon />, href: ROUTES.DATASET.SETTINGS(dataset) },
  ];

  return (
    <nav aria-label="Dataset tabs">
      <LayoutGroup id="sliding-tabs">
        <ul className="flex space-x-2">
          {tabs.map(({ name, href }) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
