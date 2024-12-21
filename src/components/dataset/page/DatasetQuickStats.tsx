import type { DatasetResponse } from "@/lib/types";
import { formatEnum } from "@/lib/utils/format";

export default function DatasetQuickStats({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const stats = [
    {
      name: "Subject Area",
      value: formatEnum(dataset.subjectArea),
    },
    {
      name: "Characteristics",
      value: formatEnum(dataset.characteristics),
    },
    {
      name: "Tasks",
      value: formatEnum(dataset.tasks),
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
      value: formatEnum(dataset.featureTypes),
    },
  ];

  return (
    <div
      className={
        "grid max-w-4xl grid-cols-1 grid-rows-3 gap-8 xs:grid-cols-2 xs:grid-rows-3 md:grid-cols-3 md:grid-rows-2"
      }
    >
      {stats.map((stat, index) => (
        <div key={index}>
          <div className={"text-sm text-muted-foreground"}>{stat.name}</div>
          <div className={"font-semibold"}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
