import { and, asc, count, desc, eq, getTableColumns, sql } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { dataset } from "@/db/schema";
import ServiceError from "@/server/service/errors";
import type { DatasetQuery } from "@/server/service/schema/dataset";
import { sortFunction } from "@/server/service/schema/lib/order";

const DATASET_WEIGHTS = sql`(SETWEIGHT(TO_TSVECTOR('simple', ${dataset.title}), 'A'))`;

function buildQuery(query: DatasetQuery) {
  const conditions = [eq(dataset.status, Enums.DatasetStatus.APPROVED)];

  if (query.keywords) {
  }

  return and(...conditions);
}

export default class DatasetFindService {
  async byId(id: number) {
    return db.query.dataset.findFirst({
      where: (dataset, { and, eq }) =>
        and(
          eq(dataset.id, id),
          eq(dataset.status, Enums.DatasetStatus.APPROVED),
        ),
      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }

  async batch(ids: number[]) {
    const datasets = await db.query.dataset.findMany({
      where: (dataset, { and, inArray }) =>
        and(
          inArray(dataset.id, ids),
          eq(dataset.status, Enums.DatasetStatus.APPROVED),
        ),
      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });

    const datasetMap = new Map(
      datasets.map((dataset) => [dataset.id, dataset]),
    );

    return ids.map((id) => {
      const dataset = datasetMap.get(id);
      if (!dataset) {
        throw new ServiceError({
          reason: "Dataset Not Found",
          origin: "Dataset",
        });
      }
      return dataset;
    });
  }

  async byUserId(userId: string) {
    return db.query.dataset.findMany({
      where: (dataset, { and, eq }) =>
        and(
          eq(dataset.userId, userId),
          eq(dataset.status, Enums.DatasetStatus.APPROVED),
        ),
      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
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
      .from(dataset)
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
          sortFunction(sort)(dataset[field as keyof typeof query.order]),
        )
      : [asc(dataset.id)];

    return db.query.dataset.findMany({
      where: buildQuery(query),
      orderBy,
      offset: query.cursor ?? 0,
      limit: query.limit ? query.limit + 1 : undefined,
      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }

  private async bySearchQuery(query: DatasetQuery) {
    const tsQuery = sql`(PLAINTO_TSQUERY('simple', ${query.search ?? ""}))`;
    const normalizedTsQuery = sql`(CASE WHEN NUMNODE(${tsQuery}) > 0 THEN TO_TSQUERY('simple', ${tsQuery}::TEXT || ':*') ELSE '' END)`;
    const rank = sql`(TS_RANK(${DATASET_WEIGHTS}, ${normalizedTsQuery}))`;
    const trigramSimilarity = sql`similarity(${dataset.title}, ${query.search})`;

    const datasets = await db
      .select({
        ...getTableColumns(dataset),
        rank: rank.mapWith(Number),
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(dataset)
      .where(
        and(
          buildQuery(query),
          query.search
            ? sql`((${DATASET_WEIGHTS} @@ ${normalizedTsQuery})
                      OR (similarity(${dataset.title}, ${query.search}) > 0.15))`
            : undefined,
        ),
      )
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) => [desc(t.rank), desc(t.similarity), desc(t.viewCount)]);

    return this.batch(datasets.map((d) => d.id));
  }
}
