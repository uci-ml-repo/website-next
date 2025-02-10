import {
  and,
  arrayContains,
  arrayOverlaps,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  lte,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { dataset, datasetView } from "@/db/schema";
import type { DatasetQuery } from "@/server/schema/dataset";
import { sortFunction } from "@/server/schema/lib/order";
import { ServiceError } from "@/server/service/errors";

const DATASET_WEIGHTS = sql`
  SETWEIGHT(
    TO_TSVECTOR('simple', ${dataset.title}),
    'A'
  )
`;

function buildQuery(query: DatasetQuery) {
  const conditions = [eq(datasetView.status, Enums.ApprovalStatus.APPROVED)];

  if (query.keywords) {
    conditions.push(arrayContains(datasetView.keywords, query.keywords));
  }

  if (query.attributes) {
    conditions.push(arrayContains(datasetView.attributes, query.attributes));
  }

  if (query.dataTypes) {
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
  async byId({
    datasetId,
    query,
  }: {
    datasetId: number;
    query?: DatasetQuery;
  }) {
    const [dataset] = await db
      .select()
      .from(datasetView)
      .where(
        and(
          query ? buildQuery(query) : undefined,
          eq(datasetView.id, datasetId),
        ),
      );
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
      .select()
      .from(datasetView)
      .where(
        and(
          inArray(datasetView.id, ids),
          eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
        ),
      );

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

  async byUserId(userId: string) {
    return db
      .select()
      .from(datasetView)
      .where(
        and(
          eq(datasetView.userId, userId),
          eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
        ),
      );
  }

  async byQuery(query: DatasetQuery) {
    let datasets;
    if (query.search) {
      datasets = await this.bySearchQuery(query);
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

  private async byRawQuery(query: DatasetQuery) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([field, sort]) =>
          sortFunction(sort)(datasetView[field as keyof typeof query.order]),
        )
      : [asc(datasetView.id)];

    return db
      .select()
      .from(datasetView)
      .where(buildQuery(query))
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 11)
      .orderBy(...orderBy);
  }

  private async bySearchQuery(query: DatasetQuery) {
    const tsQuery = sql` PLAINTO_TSQUERY('simple', ${query.search ?? ""}) `;
    const normalizedTsQuery = sql`
      CASE
        WHEN NUMNODE(${tsQuery}) > 0 THEN TO_TSQUERY(
          'simple',
          ${tsQuery}::TEXT || ':*'
        )
        ELSE ''
      END
    `;
    const rank = sql`
      TS_RANK(
        ${DATASET_WEIGHTS},
        ${normalizedTsQuery}
      )
    `;
    const trigramSimilarity = sql`
      similarity (
        ${dataset.title},
        ${query.search}
      )
    `;

    const datasets = await db
      .select({
        ...getTableColumns(dataset),
        rank: rank.mapWith(Number),
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(dataset)
      .where(
        and(
          query.search
            ? sql`
                (
                  ${DATASET_WEIGHTS} @@ ${normalizedTsQuery}
                )
                OR (
                  similarity (
                    ${dataset.title},
                    ${query.search}
                  ) > 0.1
                )
              `
            : undefined,
        ),
      )
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 11)
      .orderBy((t) =>
        query.order
          ? Object.entries(query.order).map(([field, sort]) =>
              sortFunction(sort)(dataset[field as keyof typeof query.order]),
            )
          : [desc(t.rank), desc(t.similarity), desc(t.viewCount)],
      );

    return this.batch(datasets.map((d) => d.id));
  }
}
