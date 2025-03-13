import {
  and,
  arrayContains,
  count,
  desc,
  eq,
  gt,
  notIlike,
  notInArray,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { sqlArray } from "@/db/lib/utils";
import { datasetView } from "@/db/schema";
import type { DatasetQuery } from "@/server/schema/dataset";
import { buildQuery } from "@/server/service/dataset/find";

export namespace attributeFindService {
  export async function remainingFilters({
    attributeFilters,
    query,
  }: {
    attributeFilters: string[];
    query?: DatasetQuery;
  }) {
    const attributes = await db
      .select({
        attribute: sql<string>`attribute`,
        count: count(),
      })
      .from(sql`
        ${datasetView}
        CROSS JOIN LATERAL UNNEST(${datasetView.variableNames}) AS attribute
      `)
      .where(
        and(
          query
            ? buildQuery(query)
            : eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
          notInArray(sql`attribute`, attributeFilters),
          attributeFilters.length > 0
            ? arrayContains(
                datasetView.variableNames,
                sqlArray(attributeFilters),
              )
            : undefined,
          notIlike(sql`attribute`, "attribute%"),
          notIlike(sql`attribute`, "variable%"),
        ),
      )
      .groupBy(sql`attribute`)
      .having(gt(count(), 1))
      .orderBy((t) => desc(t.count));

    const attributeCountMap = new Map<string, number>(
      attributes.map(({ attribute, count }) => [attribute, count]),
    );

    return attributeCountMap;
  }
}
