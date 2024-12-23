import type { Dataset } from "@prisma/client";
import { Columns3Icon, EyeIcon, MicroscopeIcon, Rows3Icon } from "lucide-react";
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
import { cn, datasetPage, datasetThumbnail } from "@/lib/utils";
import {
  abbreviateDecimal,
  abbreviateFileSize,
  formatEnum,
} from "@/lib/utils/format";

interface DatasetCardProps {
  dataset: Dataset;
  ref?: React.Ref<HTMLDivElement>;
}

export default function DatasetCard({ dataset, ref }: DatasetCardProps) {
  const fileCount = 1; // TODO
  const fileSize = Math.pow(2.1, 30); // TODO

  const thumbnail = datasetThumbnail(dataset);
  const href = datasetPage(dataset);

  return (
    <Card className="lift-lg group" ref={ref}>
      <Link href={href}>
        <CardHeader className={"p-0"}>
          <Image
            src={thumbnail}
            alt={"thumbnail"}
            width={350}
            height={350}
            priority
            className={
              "h-[100px] w-auto rounded-t-2xl object-cover object-center"
            }
          />
        </CardHeader>
        <CardContent className={"space-y-4"}>
          <div className={"h-26 space-y-2"}>
            <CardTitle>
              <h3 className={"line-clamp-2 group-hover:underline"}>
                {dataset.title}
              </h3>
            </CardTitle>
            <CardDescription>
              <p className={"line-clamp-3"}>
                {dataset.subtitle ?? dataset.description}
              </p>
            </CardDescription>
          </div>
          <CardDescription className="flex h-18 items-end">
            <div
              className={cn(
                "w-full space-y-1",
                "[&>div]:flex [&>div]:items-center [&>div]:space-x-2 [&_svg]:size-4",
              )}
            >
              <div>
                <MicroscopeIcon />
                <span className={"truncate"}>{formatEnum(dataset.tasks)}</span>
              </div>
              {dataset.featureCount && (
                <div>
                  <Columns3Icon />
                  <span>
                    {abbreviateDecimal(dataset.featureCount)} Features
                  </span>
                </div>
              )}
              <div>
                <Rows3Icon />
                <span>
                  {abbreviateDecimal(dataset.instanceCount)} Instances
                </span>
              </div>
            </div>
          </CardDescription>
        </CardContent>
        <CardFooter className="h-10 justify-between border-t py-2.5">
          <div className={"flex items-center space-x-1"}>
            <EyeIcon />
            <div>{abbreviateDecimal(dataset.viewCount)}</div>
          </div>
          {dataset.externalLink ? (
            <Badge variant={"secondary"}>External</Badge>
          ) : (
            <div>
              <span>{fileCount === 1 ? "1 File" : `${fileCount} Files`}</span>
              <span> &#183; </span>
              <span>{abbreviateFileSize(fileSize)}</span>
            </div>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
