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
  const tsQuery = sql` PLAINTO_TSQUERY('simple', ${search ?? ""}) `;
  const normalizedTsQuery = sql`
    CASE
      WHEN NUMNODE(${tsQuery}) > 0 THEN TO_TSQUERY(
        'simple',
        ${tsQuery}::TEXT || ':*'
      )
      ELSE ''
    END
  `;
  const tsWeights = sql`
    SETWEIGHT(
      TO_TSVECTOR('simple', ${datasetView.title}),
      'A'
    )
  `;
  const tsRank = sql`
    TS_RANK(
      ${tsWeights},
      ${normalizedTsQuery}
    )
  `;
  const trigramSimilarity = sql`
    similarity (
      ${datasetView.title},
      ${search}
    )
  `;
  const searchCondition = sql`
    (
      ${tsWeights} @@ ${normalizedTsQuery}
      OR similarity (
        ${datasetView.title},
        ${search}
      ) > 0.05
    )
  `;

  return {
    tsRank,
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
    conditions.push(
      arrayOverlaps(datasetView.keywords, sqlArray(query.keywords)),
    );
  }

  if (query.attributes?.length) {
    conditions.push(
      arrayContains(datasetView.variableNames, sqlArray(query.attributes)),
    );
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
    conditions.push(
      arrayOverlaps(datasetView.featureTypes, query.featureTypes),
    );
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

export class DatasetFindService {
  async byId(id: number) {
    const [dataset] = await db
      .select()
      .from(datasetView)
      .where(and(eq(datasetView.id, id)));

    return dataset;
  }

  async approvedById(id: number) {
    const [dataset] = await db
      .select()
      .from(datasetView)
      .where(
        and(
          eq(datasetView.id, id),
          eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
        ),
      );
    return dataset;
  }

  async batch(ids: number[]) {
    const datasets = await db
      .select(datasetPreviewSelect)
      .from(datasetView)
      .where(and(inArray(datasetView.id, ids)));

    const datasetMap = new Map(
      datasets.map((dataset) => [dataset.id, dataset]),
    );

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

  async byQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
    let datasets;
    if (query.search) {
      datasets = await this.bySearchQuery(query as DatasetSearchQuery);
    } else {
      datasets = await this.byRawQuery(query);
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

  async countByQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
    const [countQuery] = await db
      .select({ count: count() })
      .from(datasetView)
      .where(buildQuery(query));

    return countQuery.count;
  }

  private async byRawQuery(query: DatasetQuery | PrivilegedDatasetQuery) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([field, sort]) =>
          sortFunction(sort)(datasetView[field as keyof typeof query.order]),
        )
      : [desc(datasetView.viewCount)];

    return db
      .select(datasetPreviewSelect)
      .from(datasetView)
      .where(buildQuery(query))
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy(...orderBy);
  }

  private async bySearchQuery(query: DatasetSearchQuery) {
    const { trigramSimilarity, tsRank } = buildSearchQuery(query.search);

    const datasets = await db
      .select({
        id: datasetView.id,
        similarity: trigramSimilarity.mapWith(Number),
        rank: tsRank.mapWith(Number),
      })
      .from(datasetView)
      .where(buildQuery(query))
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) =>
        query.order
          ? Object.entries(query.order).map(([field, sort]) =>
              sortFunction(sort)(
                datasetView[field as keyof typeof query.order],
              ),
            )
          : [desc(t.rank), desc(t.similarity)],
      );

    return this.batch(datasets.map((d) => d.id));
  }
}
