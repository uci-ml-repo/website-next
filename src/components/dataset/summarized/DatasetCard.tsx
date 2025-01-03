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
import {
  abbreviateDecimal,
  abbreviateFileSize,
  cn,
  datasetFilesPath,
  datasetPage,
  datasetThumbnailURL,
  formatEnum,
} from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

interface DatasetCardProps {
  dataset: Dataset;
  ref?: React.Ref<HTMLDivElement>;
}

export default async function DatasetCard({ dataset, ref }: DatasetCardProps) {
  const thumbnail = datasetThumbnailURL(dataset);
  const href = datasetPage(dataset);

  let zipStats;
  try {
    zipStats = await caller.files.read.zipStats({
      path: datasetFilesPath(dataset) + ".zip",
    });
  } catch {
    zipStats = null;
  }

  return (
    <Card className="lift-lg group flex h-[360px] flex-col" ref={ref}>
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
        <CardContent className="flex flex-1 flex-col space-y-4">
          <div className="flex flex-1 flex-col space-y-2">
            <CardTitle>
              <h3 className="line-clamp-2 group-hover:underline">
                {dataset.title}
              </h3>
            </CardTitle>
            <CardDescription className="flex-1">
              <p className="line-clamp-3">
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
                <span className="truncate">{formatEnum(dataset.tasks)}</span>
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
          <div className="flex items-center space-x-1">
            <EyeIcon />
            <div>{abbreviateDecimal(dataset.viewCount)}</div>
          </div>
          {dataset.externalLink ? (
            <Badge variant="secondary">External</Badge>
          ) : (
            <>
              {zipStats ? (
                zipStats.fileCount &&
                zipStats.size && (
                  <div>
                    <span>
                      {zipStats.fileCount === 1
                        ? "1 File"
                        : `${zipStats.fileCount} Files`}
                    </span>
                    <span> &middot; </span>
                    <span>{abbreviateFileSize(zipStats.size)}</span>
                  </div>
                )
              ) : (
                <Badge variant="destructive">Missing Files</Badge>
              )}
            </>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
