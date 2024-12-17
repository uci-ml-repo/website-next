import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import DatasetCitation from "@/components/dataset/interactions/DatasetCitation";
import DatasetDownload from "@/components/dataset/interactions/DatasetDownload";
import DatasetPython from "@/components/dataset/interactions/DatasetPython";
import Main from "@/components/layout/Main";
import { Badge } from "@/components/ui/badge";
import { datasetThumbnail } from "@/lib/utils";
import { caller } from "@/server/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  const dataset = await caller.datasets.findById(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return notFound();
  }

  const thumbnail = datasetThumbnail(dataset);

  return (
    <Main className={"content space-y-6"}>
      <div className={"flex items-center justify-between"}>
        <div className={"w-full space-y-6"}>
          <div className={"space-y-4"}>
            <h1 className={"text-pretty text-4xl font-bold text-foreground"}>
              {dataset.title}
            </h1>
            {dataset.subtitle && (
              <p className={"text-lg text-muted-foreground"}>
                {dataset.subtitle}
              </p>
            )}
          </div>
          <div className={"flex w-fit gap-2 max-sm:w-full max-sm:flex-col"}>
            <DatasetDownload dataset={dataset} />
            {dataset.isAvailablePython && <DatasetPython dataset={dataset} />}
            <DatasetCitation dataset={dataset} />
          </div>
        </div>
        <Image
          src={thumbnail}
          width={300}
          height={120}
          alt={"thumbnail"}
          className={
            "ml-10 h-[120px] w-1/4 min-w-64 shrink-0 rounded-2xl object-cover object-center max-lg:hidden"
          }
          priority
        />
      </div>
      <hr />
      <div className={"flex justify-between space-x-10"}>
        <div className={"w-3/4 space-y-8"}>
          <div className={"space-y-2"}>
            <div className={"text-2xl font-bold"}>About Dataset</div>
            <div>{dataset.description}</div>
          </div>
        </div>
        <div className={"w-1/4 min-w-64 space-y-4"}>
          {/* Keywords */}
          <div className={"space-y-2"}>
            <div className={"text-lg font-bold"}>Keywords</div>
            {dataset.keywords.length === 0 ? (
              <p className={"text-muted-foreground"}>&ndash;</p>
            ) : (
              <>
                {dataset.keywords.map((datasetKeyword, index) => (
                  <Badge variant={"outline"} key={index}>
                    {datasetKeyword.keyword.name}
                  </Badge>
                ))}
              </>
            )}
          </div>

          {/* Authors */}
          <div className={"space-y-2"}>
            <div className={"text-lg font-bold"}>Authors</div>
            {dataset.authors.length === 0 ? (
              <p className={"text-muted-foreground"}>&ndash;</p>
            ) : (
              <>
                {dataset.authors.map((author, index) => (
                  <div key={index}>
                    {author.firstName} {author.lastName}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* DOI */}
          <div className={"space-y-2"}>
            <div className={"text-lg font-bold"}>DOI</div>
            {dataset.doi ? (
              <Link
                href={`https://doi.org/${dataset.doi}`}
                target={"_blank"}
                className={"text-muted-foreground underline underline-offset-2"}
              >
                {dataset.doi}
              </Link>
            ) : (
              <p className={"text-muted-foreground"}>&ndash;</p>
            )}
          </div>

          {/* License */}
          <div className={"space-y-2"}>
            <div className={"text-lg font-bold"}>License</div>
            <Link
              href={"https://creativecommons.org/licenses/by/4.0/"}
              target={"_blank"}
              className={"text-muted-foreground underline underline-offset-2"}
            >
              CC BY 4.0
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
}
