import { db } from "@packages/db";
import { dataset } from "@packages/db/schema";
import { and, count, desc, gt, notIlike, notInArray, sql } from "drizzle-orm";

import { buildQuery } from "@/server/service/dataset/util";
import type { DatasetQuery } from "@/server/types/dataset/request";

async function remainingFilters(query: DatasetQuery) {
  const existingFeatureFilters = query.features ?? [];

  const remainingFeatures = await db
    .select({
      feature: sql<string>`feature`,
      count: count(),
    })
    .from(sql`
      ${dataset}
      CROSS JOIN LATERAL UNNEST(${dataset.features}) AS feature
    `)
    .where(
      and(
        buildQuery(query),
        notInArray(sql`feature`, existingFeatureFilters),
        notIlike(sql`feature`, "attribute%"),
        notIlike(sql`feature`, "variable%"),
      ),
    )
    .groupBy(sql`feature`)
    .having(gt(count(), 1))
    .orderBy((t) => desc(t.count));

  const attributeCountMap = new Map<string, number>(
    remainingFeatures.map(({ feature, count }) => [feature, count]),
  );

  return attributeCountMap;
}
export const featureFindService = {
  remainingFilters,
};
