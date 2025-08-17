"use client";

import { LayoutGroup } from "motion/react";

const _tabs = [{ name: "About", href: "/about" }];

export function DatasetViewTabs() {
  return (
    <nav aria-label="Dataset tabs">
      <LayoutGroup id="sliding-tabs">
        <ul />
      </LayoutGroup>
    </nav>
  );
}
