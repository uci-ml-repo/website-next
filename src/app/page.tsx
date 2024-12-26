import {
  ListIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import DatasetGroup from "@/components/dataset/summarized/DatasetGroup";
import { Banner } from "@/components/icons";
import Main from "@/components/layout/Main";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTRIBUTE_PATH, DATASETS_PATH } from "@/lib/routes";
import { caller } from "@/server/trpc/server";

export default async function Page() {
  const datasrtCount = await caller.dataset.count.approved();

  const popularDatasets = await caller.dataset.find.byQuery({
    orderBy: "viewCount",
    sort: "desc",
    take: 10,
  });
  const newDatasets = await caller.dataset.find.byQuery({
    orderBy: "donatedAt",
    take: 10,
    sort: "desc",
  });

  return (
    <Main className={"space-y-8"}>
      <div className={"space-y-6"}>
        <div className={"space-y-4"}>
          <Banner variant={"hero"} />
          <p className={"text-pretty text-lg sm:text-xl"}>
            We currently maintain {datasrtCount} datasets used by millions in
            the machine learning community.
          </p>
        </div>
        <div className={"flex flex-wrap gap-4"}>
          <NavButton
            label={"Explore All Datasets"}
            variant={"blue"}
            icon={<ListIcon />}
            href={DATASETS_PATH} // TODO
          />
          <NavButton
            label={"Contribute Dataset"}
            variant={"secondary"}
            icon={<PlusIcon />}
            href={CONTRIBUTE_PATH} // TODO
          />
        </div>
        <Input
          placeholder={"Search for a dataset"}
          variantSize={"xl"}
          icon={SearchIcon}
        />
      </div>

      <div className={"space-y-10"}>
        <DatasetGroup
          icon={<TrendingUpIcon />}
          heading={"Popular Datasets"}
          seeAllHref={DATASETS_PATH} // TODO
          datasets={popularDatasets.datasets}
        />
        <hr />
        <DatasetGroup
          icon={<SparklesIcon />}
          heading={"New Datasets"}
          seeAllHref={DATASETS_PATH} // TODO
          datasets={newDatasets.datasets}
        />
        <hr />
        <div className={"space-y-8"}>
          <div className={"flex flex-col items-center space-y-4"}>
            <p className={"text-pretty text-center text-xl font-bold"}>
              Didn't find what you were looking for?
            </p>
            <Button asChild className={"lift"} size={"lg"}>
              <div>
                <SearchIcon />
                <Link href={DATASETS_PATH}>Explore All Datasets</Link>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Main>
  );
}

function NavButton({
  label,
  variant,
  icon,
  href,
}: {
  label: string;
  variant: ButtonProps["variant"];
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Button
      variant={variant}
      size={"lg"}
      className={"lift w-full sm:w-fit"}
      asChild
    >
      <Link href={href}>
        {icon}
        {label}
      </Link>
    </Button>
  );
}
