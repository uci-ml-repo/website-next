import {
  and,
  arrayContains,
  arrayOverlaps,
  count,
  desc,
  eq,
  gte,
  inArray,
  lte,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { datasetPreviewSelect } from "@/db/lib/types";
import { sqlArray } from "@/db/lib/utils";
import { datasetView } from "@/db/schema";
import type {
  DatasetQuery,
  DatasetSearchQuery,
  PrivilegedDatasetQuery,
} from "@/server/schema/dataset";
import { sortFunction } from "@/server/schema/lib/order";
import { ServiceError } from "@/server/service/errors";

function buildSearchQuery(search: string) {
  const trigramSimilarity = sql`
    similarity (
      ${datasetView.title},
      ${search}
    )
  `;

  const searchCondition = sql`
    (
      similarity (
        ${datasetView.title},
        ${search}
      ) > 0.05
    )
  `;

  return {
    trigramSimilarity,
    searchCondition,
  };
}

export function buildQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
  const conditions = [];

  if ("status" in query && query.status) {
    conditions.push(inArray(datasetView.status, query.status));
  } else {
    conditions.push(eq(datasetView.status, Enums.ApprovalStatus.APPROVED));
  }

  if ("userId" in query && query.userId) {
    conditions.push(eq(datasetView.userId, query.userId));
  }

  if (query.search) {
    const { searchCondition } = buildSearchQuery(query.search);
    conditions.push(searchCondition);
  }

  if (query.keywords?.length) {
    conditions.push(arrayOverlaps(datasetView.keywords, sqlArray(query.keywords)));
  }

  if (query.attributes?.length) {
    conditions.push(arrayContains(datasetView.variableNames, sqlArray(query.attributes)));
  }

  if (query.dataTypes?.length) {
    conditions.push(arrayOverlaps(datasetView.dataTypes, query.dataTypes));
  }

  if (query.subjectAreas) {
    conditions.push(inArray(datasetView.subjectArea, query.subjectAreas));
  }

  if (query.tasks) {
    conditions.push(arrayOverlaps(datasetView.tasks, query.tasks));
  }

  if (query.featureTypes) {
    conditions.push(arrayOverlaps(datasetView.featureTypes, query.featureTypes));
  }

  if (query.instanceCountMin) {
    conditions.push(gte(datasetView.instanceCount, query.instanceCountMin));
  }

  if (query.instanceCountMax) {
    conditions.push(lte(datasetView.instanceCount, query.instanceCountMax));
  }

  if (query.featureCountMin) {
    conditions.push(gte(datasetView.featureCount, query.featureCountMin));
  }

  if (query.featureCountMax) {
    conditions.push(lte(datasetView.featureCount, query.featureCountMax));
  }

  if (query.python) {
    conditions.push(eq(datasetView.isAvailablePython, true));
  }

  return and(...conditions);
}

export namespace datasetFindService {
  export async function byId(id: number) {
    const [dataset] = await db
      .select()
      .from(datasetView)
      .where(and(eq(datasetView.id, id)));

    return dataset;
  }

  export async function approvedById(id: number) {
    const [dataset] = await db
      .select()
      .from(datasetView)
      .where(and(eq(datasetView.id, id), eq(datasetView.status, Enums.ApprovalStatus.APPROVED)));
    return dataset;
  }

  export async function batch(ids: number[]) {
    const datasets = await db
      .select(datasetPreviewSelect)
      .from(datasetView)
      .where(and(inArray(datasetView.id, ids)));

    const datasetMap = new Map(datasets.map((dataset) => [dataset.id, dataset]));

    return ids.map((id) => {
      const dataset = datasetMap.get(id);
      if (!dataset) {
        throw new ServiceError({
          origin: "Dataset",
          message: "Dataset not found",
        });
      }
      return dataset;
    });
  }

  export async function byQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
    let datasets;
    if (query.search) {
      datasets = await bySearchQuery(query as DatasetSearchQuery);
    } else {
      datasets = await byRawQuery(query);
    }

    let nextCursor: number | undefined = undefined;
    if (query.limit && datasets.length > query.limit) {
      datasets.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db
      .select({ count: count() })
      .from(datasetView)
      .where(buildQuery(query));

    return {
      datasets,
      count: countQuery.count,
      nextCursor,
    };
  }

  export async function countByQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
    const [countQuery] = await db
      .select({ count: count() })
      .from(datasetView)
      .where(buildQuery(query));

    return countQuery.count;
  }

  async function byRawQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
    const orderBy = [];

    if ("pendingFirst" in query && query.pendingFirst) {
      orderBy.push(sql`
        CASE
          WHEN ${datasetView.status} = ${Enums.ApprovalStatus.PENDING} THEN 0
          ELSE 1
        END
      `);
    }

    orderBy.push(
      ...(query.order
        ? Object.entries(query.order).map(([field, sort]) =>
            sortFunction(sort)(datasetView[field as keyof typeof query.order]),
          )
        : [desc(datasetView.viewCount)]),
    );

    return db
      .select(datasetPreviewSelect)
      .from(datasetView)
      .where(buildQuery(query))
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy(...orderBy);
  }

  async function bySearchQuery(query: DatasetSearchQuery) {
    const { trigramSimilarity } = buildSearchQuery(query.search);

    const datasets = await db
      .select({
        id: datasetView.id,
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(datasetView)
      .where(buildQuery(query))
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) =>
        query.order
          ? Object.entries(query.order).map(([field, sort]) =>
              sortFunction(sort)(datasetView[field as keyof typeof query.order]),
            )
          : [desc(t.similarity)],
      );

    return batch(datasets.map((d) => d.id));
  }
}
