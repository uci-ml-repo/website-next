import { db } from "@packages/db";
import { dataset } from "@packages/db/schema";
import { and, count, desc, gt, notIlike, notInArray, sql } from "drizzle-orm";

import { buildQuery } from "@/server/service/dataset/util";
import type { DatasetQuery } from "@/server/types/dataset/request";

async function remainingFilters(query: DatasetQuery) {
  const existingFeatureFilters = query.features ?? [];

  const feature = sql<string>`feature`;

  const remainingFeatures = await db
    .select({
      feature,
      count: count(),
    })
    .from(dataset)
    .crossJoinLateral(sql`UNNEST(${dataset.features}) AS ${feature}`)
    .where(
      and(
        buildQuery(query),
        notInArray(feature, existingFeatureFilters),
        notIlike(feature, "attribute%"),
        notIlike(feature, "variable%"),
      ),
    )
    .groupBy(feature)
    .having(gt(count(), 1))
    .orderBy((t) => desc(t.count));

  return new Map<string, number>(remainingFeatures.map(({ feature, count }) => [feature, count]));
}
export const featureFindService = {
  remainingFilters,
};
