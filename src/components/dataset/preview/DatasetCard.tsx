import {
  CalendarDaysIcon,
  Columns3Icon,
  EyeIcon,
  MicroscopeIcon,
  Rows3Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DatasetSelect } from "@/db/types";
import { DATASET_ROUTE, DATASET_THUMBNAIL_ROUTE } from "@/lib/routes";
import {
  abbreviateDecimal,
  abbreviateFileSize,
  cn,
  formatEnum,
} from "@/lib/utils";

interface DatasetCardProps {
  dataset: DatasetSelect;
  ref?: React.Ref<HTMLDivElement>;
}

export default function DatasetCard({ dataset, ref }: DatasetCardProps) {
  const thumbnail = DATASET_THUMBNAIL_ROUTE(dataset);
  const href = DATASET_ROUTE(dataset);

  return (
    <Card className="lift-lg group flex h-[355px] flex-col" ref={ref}>
      <Link href={href} className="flex flex-1 flex-col">
        <CardHeader className="p-0">
          <Image
            src={thumbnail}
            alt="thumbnail"
            width={350}
            height={100}
            priority
            className="h-[100px] w-full rounded-t-2xl object-cover object-center"
          />
        </CardHeader>

        <DatasetCardContent dataset={dataset} />
      </Link>
    </Card>
  );
}

export function DatasetCardContent({
  dataset,
  descriptionClassName,
}: {
  dataset: DatasetSelect;
  descriptionClassName?: string;
}) {
  return (
    <>
      <CardContent className="flex flex-1 flex-col space-y-2">
        <div className="flex flex-1 flex-col space-y-2">
          <CardTitle>
            <h3 className="line-clamp-2 group-hover:underline">
              {dataset.title}
            </h3>
          </CardTitle>
          <CardDescription className="flex-1">
            <p className={cn(descriptionClassName ?? "line-clamp-2")}>
              {dataset.subtitle ?? dataset.description}
            </p>
          </CardDescription>
        </div>
        <CardDescription className="flex items-end">
          <div
            className={cn(
              "w-full space-y-1",
              "[&>div]:flex [&>div]:items-center [&>div]:space-x-2 [&_svg]:size-4",
            )}
          >
            {dataset.tasks && (
              <div>
                <MicroscopeIcon />
                <span className="truncate">{formatEnum(dataset.tasks)}</span>
              </div>
            )}
            {dataset.yearCreated && (
              <div>
                <CalendarDaysIcon />
                <span className="truncate">{dataset.yearCreated}</span>
              </div>
            )}
            {dataset.featureCount && (
              <div>
                <Columns3Icon />
                <span>{abbreviateDecimal(dataset.featureCount)} Features</span>
              </div>
            )}
            {dataset.instanceCount && (
              <div>
                <Rows3Icon />
                <span>
                  {abbreviateDecimal(dataset.instanceCount)} Instances
                </span>
              </div>
            )}
          </div>
        </CardDescription>
      </CardContent>
      <CardFooter className="h-10 justify-between border-t py-2.5 @container">
        <div className="flex items-center space-x-1">
          <EyeIcon />
          <div>{abbreviateDecimal(dataset.viewCount)}</div>
        </div>
        {dataset.externalLink ? (
          <Badge variant="secondary">External</Badge>
        ) : (
          <>
            {dataset.fileCount !== null && dataset.size !== null ? (
              <div className="flex items-center space-x-1">
                <span className="hidden @3xs:block">
                  {dataset.fileCount === 1
                    ? "1 File"
                    : `${dataset.fileCount} Files`}
                </span>
                <span className="hidden @3xs:block">&middot;</span>
                <span>{abbreviateFileSize(dataset.size)}</span>
              </div>
            ) : (
              <Badge variant="destructive">Missing Files</Badge>
            )}
          </>
        )}
      </CardFooter>
    </>
  );
}
