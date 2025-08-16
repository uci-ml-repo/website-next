import { db } from "@packages/db";
import { author, dataset } from "@packages/db/schema";
import { desc, eq } from "drizzle-orm";

import { buildQuery, buildSearchQuery } from "@/server/service/dataset/util";
import type { AuthorSelect } from "@/server/types/author/response";
import type { DatasetQuery } from "@/server/types/dataset/request";
import { datasetColumns } from "@/server/types/dataset/request";
import { sortMap } from "@/server/types/util/order";
import { entriesT } from "@/server/types/util/type";

async function byId(id: number) {
  const results = await db
    .select()
    .from(dataset)
    .leftJoin(author, eq(dataset.id, author.datasetId))
    .where(eq(dataset.id, id));

  const authors = results.reduce<AuthorSelect[]>((acc, r) => {
    if (r.author) acc.push(r.author);
    return acc;
  }, []);

  return {
    ...results[0].dataset,
    authors,
  };
}

async function byQuery(query: DatasetQuery) {
  const orderBy = query.order
    ? entriesT(query.order).map(([field, sort]) => sortMap[sort ?? "asc"](dataset[field]))
    : [];

  const datasets = await db
    .select({
      ...datasetColumns,
      ...(query.search
        ? { similarity: buildSearchQuery(query.search).trigramSimilarity.mapWith(Number) }
        : {}),
    })
    .from(dataset)
    .where(buildQuery(query))
    .orderBy((t) =>
      t.similarity
        ? [...orderBy, desc(t.similarity)]
        : orderBy.length
          ? orderBy
          : desc(dataset.viewCount),
    )
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
