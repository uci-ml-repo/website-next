import { db } from "@packages/db";
import { dataset } from "@packages/db/schema";
import { and, desc, eq } from "drizzle-orm";

import type { DatasetQuery, PrivilegedDatasetQuery } from "@/server/types/dataset/request";
import { sortMap } from "@/server/types/util/order";
import { entriesT } from "@/server/types/util/type";

async function byId(id: number) {
  const [result] = await db.select().from(dataset).where(eq(dataset.id, id));
  return result;
}

function buildQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
  const conditions = [];

  if ("userId" in query && query.userId) {
    conditions.push(eq(dataset.userId, query.userId));
  }

  if (query.isAvailablePython !== undefined) {
    conditions.push(eq(dataset.isAvailablePython, query.isAvailablePython));
  }

  return and(...conditions);
}

async function byQuery(query: DatasetQuery) {
  const orderBy = query.order
    ? entriesT(query.order).map(([field, sort]) => sortMap[sort ?? "asc"](dataset[field]))
    : [desc(dataset.viewCount)];

  return db
    .select()
    .from(dataset)
    .where(buildQuery(query))
    .orderBy(...orderBy)
    .offset(query.cursor ?? 0)
    .limit(query.limit ? query.limit + 1 : 10);
}

export const datasetFindService = { byId, byQuery };
