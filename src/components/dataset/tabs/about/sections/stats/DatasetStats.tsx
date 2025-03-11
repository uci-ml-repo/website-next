"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetSubjectAreaDialog } from "@/components/dataset/tabs/about/sections/stats/DatasetSubjectAreaDialog";
import { formatEnum } from "@/lib/utils";

type DatasetStat = {
  name: string;
  value: string | number | null;
  edit: React.ReactNode;
};

export function DatasetStats() {
  const { dataset, editing } = useDataset();

  const stats: DatasetStat[] = [
    {
      name: "Subject Area",
      value: formatEnum(dataset.subjectArea ?? ""),
      edit: <DatasetSubjectAreaDialog />,
    },
    {
      name: "Instances",
      value: dataset.instanceCount,
      edit: <div />,
    },
    {
      name: "Features",
      value: dataset.featureCount,
      edit: <div />,
    },
    {
      name: "Data Types",
      value: formatEnum(dataset.dataTypes ?? ""),
      edit: <div />,
    },
    {
      name: "Tasks",
      value: formatEnum(dataset.tasks ?? ""),
      edit: <div />,
    },
    {
      name: "Feature Types",
      value: formatEnum(dataset.featureTypes ?? ""),
      edit: <div />,
    },
  ];

  return (
    <div className="flex">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 min-[360px]:grid-cols-2 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="flex space-x-2">
            <div>
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
            {editing && stat.edit}
          </div>
        ))}
      </div>
    </div>
  );
}
