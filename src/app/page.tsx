import { ListIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import NewDatasets from "@/components/dataset/groups/NewDatasets";
import PopularDatasets from "@/components/dataset/groups/PopularDatasets";
import { Banner } from "@/components/icons";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { caller, HydrateClient, trpc } from "@/server/trpc/server";

export default async function Page() {
  void trpc.datasets.find.prefetch({
    orderBy: "viewCount",
    sort: "desc",
    take: 4,
  });

  void trpc.datasets.find.prefetch({
    orderBy: "donatedAt",
    take: 4,
    sort: "desc",
  });

  const datasetFind = await caller.datasets.find({});

  return (
    <main className={"content space-y-8"}>
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
        <HydrateClient>
          <PopularDatasets />
          <hr />
          <NewDatasets />
        </HydrateClient>
      </div>
    </main>
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
