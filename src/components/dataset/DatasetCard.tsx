import { Columns3Icon, EyeIcon, MicroscopeIcon, Rows3Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { datasetHref, datasetThumbnail } from "@/lib/utils";
import {
  abbreviateDecimal,
  abbreviateFileSize,
  formatEnum,
} from "@/lib/utils/format";
import type { RouterOutput } from "@/server/trpc/routers";

interface DatasetCardProps {
  dataset: RouterOutput["datasets"]["find"]["datasets"][number];
  ref?: React.Ref<HTMLDivElement>;
}

export default function DatasetCard({ dataset, ref }: DatasetCardProps) {
  const thumbnail = datasetThumbnail(dataset);
  const href = datasetHref(dataset);

  return (
    <Card className="lift-lg group" ref={ref}>
      <Link href={href}>
        <CardHeader className={"p-0"}>
          <Image
            src={thumbnail}
            alt={"thumbnail"}
            width={350}
            height={100}
            className={
              "h-[100px] w-full rounded-t-2xl object-cover object-center"
            }
          />
        </CardHeader>
        <CardContent className={"space-y-4"}>
          <div className={"h-28 space-y-2"}>
            <CardTitle>
              <h3 className={"line-clamp-2 group-hover:underline"}>
                {dataset.title}
              </h3>
            </CardTitle>
            <CardDescription>
              <p className={"line-clamp-3"}>
                {dataset.subtitle ?? dataset.abstract}
              </p>
            </CardDescription>
          </div>
          <CardDescription>
            <div className="space-y-1 [&>div]:flex [&>div]:items-center [&>div]:space-x-2 [&_svg]:size-4">
              <div>
                <MicroscopeIcon />
                <div className={"truncate"}>{formatEnum(dataset.tasks)}</div>
              </div>
              <div>
                <Columns3Icon />
                <div>{abbreviateDecimal(dataset.featureCount)} Features</div>
              </div>
              <div>
                <Rows3Icon />
                <div>{abbreviateDecimal(dataset.instanceCount)} Instances</div>
              </div>
            </div>
          </CardDescription>
        </CardContent>
        <CardFooter className="h-10 justify-between border-t py-2.5">
          <div className={"flex items-center space-x-1"}>
            <EyeIcon />
            <div>{abbreviateDecimal(dataset.viewCount)}</div>
          </div>
          <div>
            {1} File &#183; {abbreviateFileSize(Math.pow(2.1, 34))}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
