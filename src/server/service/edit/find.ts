import { and, count, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { edit } from "@/db/schema";
import type { EditQuery } from "@/server/schema/edit";

function buildQuery(query: EditQuery) {
  const conditions = [];

  if (query.datasetId) {
    conditions.push(eq(edit.datasetId, query.datasetId));
  }

  if (query.status) {
    conditions.push(inArray(edit.status, query.status));
  }

  return and(...conditions);
}

export class EditFindService {
  async byQuery(query: EditQuery) {
    return db.select().from(edit).where(buildQuery(query));
  }

  async countByQuery(query: EditQuery) {
    const [countQuery] = await db
      .select({ count: count() })
      .from(edit)
      .where(buildQuery(query));

    return countQuery.count;
  }
}
