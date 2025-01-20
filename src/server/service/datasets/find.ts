import { and, asc, count, desc } from "drizzle-orm";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import type { DatasetQuery } from "@/server/schema/datasets";

function buildQuery(query: DatasetQuery) {
  return and();
}

export default class DatasetsFindService {
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
    const sortFunction = query.sort === "desc" ? desc : asc;

    const datasetsQuery = await db
      .select()
      .from(dataset)
      .where(buildQuery(query))
      .orderBy(sortFunction(dataset[query.orderBy ?? "id"]))
      .offset(query.skip ?? 0)
      .limit(query.take ?? 100);

    const [countQuery] = await db
      .select({ count: count() })
      .from(dataset)
      .where(buildQuery(query));

    return {
      datasets: datasetsQuery,
      count: countQuery.count,
    };
  }

  async byUserId(userId: string) {
    return db.query.dataset.findMany({
      where: (dataset, { eq }) => eq(dataset.userId, userId),
    });
  }
}
