import { Enums } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { and, arrayContains, arrayOverlaps, eq, gt, inArray, lt, sql } from "drizzle-orm";

import type { DatasetQuery, PrivilegedDatasetQuery } from "@/server/types/dataset/request";

export function buildQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
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

  if (query.keywords?.length) {
    conditions.push(arrayOverlaps(dataset.keywords, query.keywords));
  }

  if (query.features?.length) {
    conditions.push(arrayContains(dataset.features, query.features));
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

  if (query.featureCount?.min !== undefined) {
    conditions.push(gt(dataset.featureCount, query.featureCount.min));
  }

  if (query.featureCount?.max !== undefined) {
    conditions.push(lt(dataset.featureCount, query.featureCount.max));
  }

  if (query.instanceCount?.min !== undefined) {
    conditions.push(gt(dataset.instanceCount, query.instanceCount.min));
  }

  if (query.instanceCount?.max !== undefined) {
    conditions.push(lt(dataset.instanceCount, query.instanceCount.max));
  }

  if (query.isAvailablePython !== undefined) {
    conditions.push(eq(dataset.isAvailablePython, query.isAvailablePython));
  }

  return and(...conditions);
}

export function buildSearchQuery(search: string, minSimilarity = 0.05) {
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
