"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { formatEnum } from "@/lib/utils";

export function DatasetQuickStats() {
  const { dataset } = useDataset();

  const stats = [
    {
      name: "Subject Area",
      value: formatEnum(dataset.subjectArea ?? ""),
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
      name: "Features",
      value: dataset.featureCount,
    },
    {
      name: "Instances",
      value: dataset.instanceCount,
    },
    {
      name: "Feature Types",
      value: formatEnum(dataset.featureTypes ?? ""),
    },
  ];

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-8 min-[360px]:grid-cols-2 md:grid-cols-3">
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
  );
}
