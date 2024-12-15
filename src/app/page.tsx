import {
  ListIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import DatasetGroup from "@/components/dataset/groups/DatasetGroup";
import { Banner } from "@/components/icons";
import Main from "@/components/layout/Main";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { caller } from "@/server/trpc/server";

export default async function Page() {
  const datasetFind = await caller.datasets.find({});
  const popularDatasets = await caller.datasets.find({
    orderBy: "viewCount",
    sort: "desc",
    take: 4,
  });
  const newDatasets = await caller.datasets.find({
    orderBy: "donatedAt",
    take: 4,
    sort: "desc",
  });

  return (
    <Main className={"space-y-8"}>
      <div className={"space-y-6"}>
        <div className={"space-y-4"}>
          <Banner variant={"hero"} />
          <p className={"text-lg sm:text-xl"}>
            We currently maintain {datasetFind.count} datasets used by millions
            in the machine learning community.
          </p>
        </div>
        <NavButtons />
      </div>

      <Input
        placeholder={"Search for a dataset"}
        variantSize={"lg"}
        icon={SearchIcon}
        pill
      />

      <div className={"space-y-10"}>
        <DatasetGroup
          icon={<TrendingUpIcon />}
          heading={"Popular Datasets"}
          seeAllHref={"#"}
          datasets={popularDatasets.datasets}
        />
        <hr />
        <DatasetGroup
          icon={<SparklesIcon />}
          heading={"New Datasets"}
          seeAllHref={"#"}
          datasets={newDatasets.datasets}
        />
      </div>
    </Main>
  );
}

function NavButtons() {
  const buttons = [
    {
      label: "View All Datasets",
      variant: "blue",
      icon: <ListIcon />,
      href: "/datasets",
    },
    {
      label: "Donate Dataset",
      variant: "secondary",
      icon: <PlusIcon />,
      href: "/donate",
    },
  ];

  return (
    <div className={"flex flex-wrap gap-4"}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant as ButtonProps["variant"]}
          size={"lg"}
          className={"lift w-full sm:w-fit"}
          asChild
          pill
        >
          <Link href={button.href}>
            {button.icon}
            {button.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
