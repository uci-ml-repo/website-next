"use client";

import type { DatasetSelect } from "@packages/db/types";
import { LayoutGroup } from "motion/react";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";

export function DatasetViewTabs({ dataset }: { dataset: DatasetSelect }) {
  const tabs = [
    { name: "About", href: ROUTES.DATASET(dataset) },
    { name: "Files", href: ROUTES.DATASET.FILES(dataset) },
  ];

  return (
    <nav aria-label="Dataset tabs">
      <LayoutGroup id="sliding-tabs">
        <ul className="flex space-x-2">
          {tabs.map(({ name, href }) => (
            <Link key={name} href={href}>
              {name}
            </Link>
          ))}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
