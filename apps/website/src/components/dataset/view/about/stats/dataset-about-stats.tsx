"use client";

import type { DatasetFull } from "@/server/types/dataset/response";
import { formatEnum } from "@/server/types/util/enum";

type DatasetStat = {
  name: string;
  value: string | number | null;
};

export function DatasetAboutStats({ dataset }: { dataset: DatasetFull }) {
  const stats: DatasetStat[] = [
    {
      name: "Subject Area",
      value: dataset.subjectArea ? formatEnum(dataset.subjectArea) : null,
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
      value: formatEnum(dataset.dataTypes),
    },
    {
      name: "Tasks",
      value: formatEnum(dataset.tasks),
    },
    {
      name: "Feature Types",
      value: formatEnum(dataset.featureTypes),
    },
  ];

  return (
    <div className="@container flex">
      <div className="grid w-full max-w-4xl grid-cols-3 gap-8 @max-lg:grid-cols-2 @max-xs:grid-cols-1">
        {stats.map((stat) => (
          <div key={stat.name}>
            <div className="text-muted-foreground text-sm">{stat.name}</div>
            {stat.value ? (
              <div className="font-semibold">
                {typeof stat.value === "number" ? stat.value.toLocaleString("en") : stat.value}
              </div>
            ) : (
              <div className="text-muted-foreground">&ndash;</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
