import { db } from "@packages/db";
import { Enums } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { and, arrayOverlaps, desc, eq, gt, inArray, sql } from "drizzle-orm";

import type { DatasetQuery, PrivilegedDatasetQuery } from "@/server/types/dataset/request";
import { datasetColumns } from "@/server/types/dataset/request";
import { sortMap } from "@/server/types/util/order";
import { entriesT } from "@/server/types/util/type";

async function byId(id: number) {
  const [result] = await db.select().from(dataset).where(eq(dataset.id, id));
  return result;
}

function buildQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
  const conditions = [];

  if ("status" in query && query.status) {
    conditions.push(inArray(dataset.status, query.status));
  } else {
    conditions.push(eq(dataset.status, Enums.ApprovalStatus.APPROVED));
  }

  if ("userId" in query && query.userId) {
    conditions.push(eq(dataset.userId, query.userId));
  }

  if (query.search) {
    conditions.push(buildSearchQuery(query.search).searchCondition);
  }

  if (query.subjectAreas) {
    conditions.push(inArray(dataset.subjectArea, query.subjectAreas));
  }

  if (query.tasks) {
    conditions.push(arrayOverlaps(dataset.tasks, query.tasks));
  }

  if (query.dataTypes?.length) {
    conditions.push(arrayOverlaps(dataset.dataTypes, query.dataTypes));
  }

  if (query.featureTypes) {
    conditions.push(arrayOverlaps(dataset.featureTypes, query.featureTypes));
  }

  if (query.isAvailablePython !== undefined) {
    conditions.push(eq(dataset.isAvailablePython, query.isAvailablePython));
  }

  return and(...conditions);
}

function buildSearchQuery(search: string, minSimilarity = 0.05) {
  const trigramSimilarity = sql`
    similarity (
      ${dataset.title},
      ${search}
    )
  `;

  return {
    trigramSimilarity,
    searchCondition: gt(trigramSimilarity, minSimilarity),
  };
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
