import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { dataset } from "@/db/schema";
import type { DatasetQuery } from "@/server/service/schema/datasets";
import { sortFunction } from "@/server/service/schema/lib/order";

function buildQuery(query: DatasetQuery) {
  return and(eq(dataset.status, Enums.DatasetStatus.APPROVED));
}

export default class DatasetFindService {
  async byId(id: number) {
    return db.query.dataset.findFirst({
      where: (dataset, { eq }) => eq(dataset.id, id),
      with: {
        datasetKeywords: {
          with: {
            keyword: true,
          },
        },
        authors: true,
        introductoryPaper: true,
        variables: true,
        user: true,
      },
    });
  }

  // TODO: Implement Fuzzy
  async byTitle(title: string) {
    return undefined;
  }

  async byQuery(query: DatasetQuery) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(dataset[orderBy as keyof typeof query.order]),
        )
      : [asc(dataset.id)];

    const datasets = await db.query.dataset.findMany({
      where: buildQuery(query),
      orderBy: orderBy,
      limit: query.limit,
      offset: query.offset,
    });

    const [countQuery] = await db
      .select({ count: count() })
      .from(dataset)
      .where(buildQuery(query));

    return {
      datasets,
      count: countQuery.count,
    };
  }

  async byUserId(userId: string) {
    return db.query.dataset.findMany({
      where: (dataset, { eq }) => eq(dataset.userId, userId),
    });
  }
}
