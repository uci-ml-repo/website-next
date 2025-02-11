"use client";

import { getMaterializedViewConfig } from "drizzle-orm/pg-core";

import { Main } from "@/components/layout/Main";
import { datasetView } from "@/db/schema";

export default function Test() {
  const cols = getMaterializedViewConfig(datasetView).selectedFields;

  console.log(JSON.stringify(cols));

  return <Main />;
}
