import { sql } from "drizzle-orm";

import { db } from "@/db";
import { datasetView } from "@/db/schema";

export class AttributeFindService {
  async remainingFilters(attributeFilters: string[]) {
    const attributes = await db.execute(sql`
      (
        SELECT DISTINCT
          attribute
        FROM
          ${datasetView},
          UNNEST(${datasetView.variableNames}) AS attribute
        WHERE
          ${datasetView.variableNames} @> ${attributeFilters}
      )
    `);

    return attributes;
  }
}
