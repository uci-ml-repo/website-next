import {
  and,
  arrayContains,
  count,
  desc,
  eq,
  notInArray,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { datasetView } from "@/db/schema";

export class AttributeFindService {
  async remainingFilters(attributeFilters: string[]) {
    const attributes = await db
      .select({
        attribute: sql`attribute`,
        count: count(),
      })
      .from(sql`
        ${datasetView}
        CROSS JOIN LATERAL UNNEST(${datasetView.variableNames}) AS attribute
      `)
      .where(
        and(
          eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
          notInArray(sql`attribute`, attributeFilters),
          attributeFilters.length > 0
            ? arrayContains(datasetView.variableNames, attributeFilters)
            : undefined,
        ),
      )
      .groupBy(sql`attribute`)
      .orderBy((t) => desc(t.count));

    return attributes;
  }
}
