import { db } from "@packages/db";
import { dataset } from "@packages/db/schema";
import { desc, eq } from "drizzle-orm";

import { buildQuery, buildSearchQuery } from "@/server/service/dataset/util";
import type { DatasetQuery } from "@/server/types/dataset/request";
import { datasetColumns } from "@/server/types/dataset/request";
import { sortMap } from "@/server/types/util/order";
import { entriesT } from "@/server/types/util/type";

async function byId(id: number) {
  const [result] = await db.select().from(dataset).where(eq(dataset.id, id));
  return result;
}

async function byQuery(query: DatasetQuery) {
  const orderBy = query.order
    ? entriesT(query.order).map(([field, sort]) => sortMap[sort ?? "asc"](dataset[field]))
    : [desc(dataset.viewCount)];

  const datasets = await db
    .select({
      ...datasetColumns,
      ...(query.search
        ? { similarity: buildSearchQuery(query.search).trigramSimilarity.mapWith(Number) }
        : {}),
    })
    .from(dataset)
    .where(buildQuery(query))
    .orderBy((t) => (t.similarity ? [desc(t.similarity), ...orderBy] : orderBy))
    .offset(query.cursor ?? 0)
    .limit(query.limit + 1);

  let nextCursor: number | undefined = undefined;
  if (datasets.length > query.limit) {
    datasets.pop();
    nextCursor = (query.cursor ?? 0) + query.limit;
  }

  const count = await db.$count(dataset, buildQuery(query));

  return { datasets, count, nextCursor };
}

export const datasetFindService = { byId, byQuery };
