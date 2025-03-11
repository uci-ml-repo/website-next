"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditFieldButton } from "@/components/dataset/edit/DatasetEditFieldButton";
import { DatasetClassificationForm } from "@/components/dataset/tabs/about/sections/classification/DatasetClassificationForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatEnum } from "@/lib/utils";

export function DatasetClassification() {
  const { dataset, editingFields, stopEditingField } = useDataset();

  const stats = [
    {
      name: "Subject Area",
      value: formatEnum(dataset.subjectArea ?? ""),
    },
    {
      name: "Instances",
      value: dataset.instanceCount,
    },
    {
      name: "Features",
      value: dataset.featureCount,
    },
    {
      name: "Data Types",
      value: formatEnum(dataset.dataTypes ?? ""),
    },
    {
      name: "Tasks",
      value: formatEnum(dataset.tasks ?? ""),
    },
    {
      name: "Feature Types",
      value: formatEnum(dataset.featureTypes ?? ""),
    },
  ];

  return (
    <div className="flex">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 min-[360px]:grid-cols-2 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name}>
            <div className="text-sm text-muted-foreground">{stat.name}</div>
            {stat.value ? (
              <div className="font-semibold">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString("en")
                  : stat.value}
              </div>
            ) : (
              <div className="text-muted-foreground">&ndash;</div>
            )}
          </div>
        ))}
      </div>

      <DatasetEditFieldButton
        aria-label="Edit dataset additional information"
        field="classification"
      />

      <Dialog
        open={editingFields["classification"]}
        onOpenChange={(openState) => {
          if (!openState) stopEditingField("classification");
        }}
      >
        <DialogContent>
          <DialogTitle>Edit dataset classification information</DialogTitle>
          <DatasetClassificationForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
