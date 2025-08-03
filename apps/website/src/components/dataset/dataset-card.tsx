import { CalendarDaysIcon, Columns3Icon, MicroscopeIcon, Rows3Icon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { abbreviateDecimal } from "@/lib/util/abbreviate";
import { cn } from "@/lib/util/cn";
import type { DatasetSelect } from "@/server/types/dataset/response";
import { formatEnum } from "@/server/types/util/enum";

interface Props extends ComponentProps<typeof Card> {
  dataset: DatasetSelect;
}

type DatasetStat = {
  icon: React.ReactNode;
  text: string | null;
  tooltip?: string;
};

export function DatasetCard({ dataset, className, ...props }: Props) {
  const _datasetStats: DatasetStat[] = [
    {
      icon: <MicroscopeIcon />,
      text: dataset.tasks ? formatEnum(dataset.tasks) : null,
      tooltip: "Dataset Tasks",
    },
    {
      icon: <Columns3Icon />,
      text: dataset.featureCount ? `${abbreviateDecimal(dataset.featureCount)} Features` : null,
      tooltip: "Number of Features",
    },
    {
      icon: <Rows3Icon />,
      text: dataset.instanceCount ? `${abbreviateDecimal(dataset.instanceCount)} Instances` : null,
      tooltip: "Number of Instances",
    },
    {
      icon: <CalendarDaysIcon />,
      text: dataset.yearCreated ? dataset.yearCreated.toString() : null,
      tooltip: "Year Created",
    },
  ];

  return (
    <Link href={ROUTES.DATASET.DATASET(dataset)} className="lift block rounded-2xl">
      <Card className={cn("group flex h-(--dataset-card-height) flex-col", className)} {...props}>
        <div className="bg-destructive h-24 w-full rounded-t-2xl object-cover object-center">X</div>
      </Card>
    </Link>
  );
}
