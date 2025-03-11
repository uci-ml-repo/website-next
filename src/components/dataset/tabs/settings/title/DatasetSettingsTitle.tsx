"use client";

import { InfoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { useDatasetFileStatus } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { DatasetSettingsTitleForm } from "@/components/dataset/tabs/settings/title/DatasetSettingsTitleForm";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CONTACT_ROUTE } from "@/lib/routes";

export function DatasetSettingsTitle() {
  const { dataset, editing, setEditing, editingFields } = useDataset();
  const { fileStatus, pendingFileStatus } = useDatasetFileStatus();

  return (
    <div className="space-y-1">
      <h3 className="text-xl font-bold">Title</h3>

      {editingFields["title"] ? (
        <DatasetSettingsTitleForm />
      ) : (
        <div className="flex items-center space-x-2">
          <div className="text-lg">{dataset.title}</div>
          {fileStatus !== "unzipping" && pendingFileStatus !== "unzipping" ? (
            <DatasetEditFieldButton
              alwaysVisible
              field="title"
              onClick={() => {
                if (!editing) {
                  setEditing(true);
                }
              }}
            />
          ) : (
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger>
                <InfoIcon className="size-5 cursor-pointer text-muted-foreground" />
              </HoverCardTrigger>
              <HoverCardContent className="space-y-1">
                <div>Cannot edit title while files are processing.</div>
                <div className="text-muted-foreground">
                  Need help?{" "}
                  <Link href={CONTACT_ROUTE} className="underline">
                    Contact us
                  </Link>
                  .
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      )}
    </div>
  );
}
