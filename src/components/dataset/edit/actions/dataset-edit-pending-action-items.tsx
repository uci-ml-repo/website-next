import { redirect } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { DATASET_FILES_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export type ActionPriority = "required" | "recommended" | null;

type ActionItem = {
  title: string;
  description: string;
  priority: ActionPriority;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

export function actionItems({
  dataset,
  hasFiles,
  canSubmit,
}: {
  dataset: DatasetResponse;
  hasFiles: boolean;
  canSubmit: boolean;
}) {
  const actions: ActionItem[] = [];

  if (!dataset.externalLink && !hasFiles) {
    actions.push({
      title: "Upload Files",
      description: "Upload dataset files to share with the community.",
      priority: "required",
      onClick: () => redirect(DATASET_FILES_ROUTE(dataset)),
    });
  }

  if (!dataset.description) {
    actions.push({
      title: "Add description",
      description:
        "Add details about your dataset to help others understand its contents.",
      priority: "required",
    });
  }

  if (!dataset.hasGraphics) {
    actions.push({
      title: "Upload thumbnail",
      description: "Upload a thumbnail image to represent your dataset.",
      priority: "recommended",
    });
  }

  actions.push({
    title: "Submit for review",
    description: "Submit your dataset for review.",
    priority: null,
    children: (
      <div className="flex h-full items-center justify-between">
        <Button disabled={!canSubmit} className="mx-auto" variant="positive">
          Submit
        </Button>
      </div>
    ),
    disabled: !canSubmit,
  });

  return actions;
}
