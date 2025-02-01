import { and, asc, count, desc, eq, getTableColumns, sql } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { dataset } from "@/db/schema";
import type { DatasetQuery } from "@/server/service/schema/datasets";
import { sortFunction } from "@/server/service/schema/lib/order";

const DATASET_WEIGHTS = sql`(SETWEIGHT(TO_TSVECTOR('english', ${dataset.title}), 'A'))`;

function buildQuery(query: DatasetQuery) {
  const conditions = [eq(dataset.status, Enums.DatasetStatus.APPROVED)];

  if (query.keywords) {
  }

  return and(...conditions);
}

export default class DatasetFindService {
  async byId(id: number) {
    return db.query.dataset.findFirst({
      where: (dataset, { eq }) => eq(dataset.id, id),
      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }

  async byUserId(userId: string) {
    return db.query.dataset.findMany({
      where: (dataset, { eq }) => eq(dataset.userId, userId),
      with: {
        datasetKeywords: { with: { keyword: true } },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }

  async byTitle(title: string) {
    return undefined;
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

    return await db.query.dataset.findMany({
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
    const tsQuery = sql`(PLAINTO_TSQUERY('english', ${query.search ?? ""}))`;
    const normalizedTsQuery = sql`(CASE WHEN NUMNODE(${tsQuery}) > 0 THEN TO_TSQUERY('english', ${tsQuery}::TEXT || ':*') ELSE '' END)`;
    const rank = sql`(TS_RANK(${DATASET_WEIGHTS}, ${normalizedTsQuery}))`;

    return db
      .select({
        ...getTableColumns(dataset),
        rank: rank.mapWith(Number),
      })
      .from(dataset)
      .where(
        and(
          buildQuery(query),
          query.search
            ? sql`(${DATASET_WEIGHTS} @@ ${normalizedTsQuery})`
            : undefined,
        ),
      )
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) => [desc(t.rank), desc(t.viewCount)]);
  }
}
