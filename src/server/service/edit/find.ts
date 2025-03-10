import { and, count, eq, inArray, max } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { edit } from "@/db/schema";
import type { EditQuery } from "@/server/schema/edit";
import { ServiceError } from "@/server/service/errors";

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
  async byId({
    datasetId,
    pending,
    version,
  }: {
    datasetId: number;
    pending?: boolean;
    version?: number;
  }) {
    if (!pending && !version) {
      throw new ServiceError({
        origin: "Edit",
        message: "Must provide either `pending` or `versionId`",
      });
    }

    return db.query.edit.findFirst({
      where: and(
        eq(edit.datasetId, datasetId),
        version ? eq(edit.version, version) : undefined,
        pending ? eq(edit.status, Enums.EditStatus.PENDING) : undefined,
      ),
    });
  }

  async byQuery(query: EditQuery) {
    const edits = db
      .select()
      .from(edit)
      .where(buildQuery(query))
      .offset(query.offset ?? 0)
      .limit(query.limit ?? 10);

    const [countQuery] = await db
      .select({ count: count() })
      .from(edit)
      .where(buildQuery(query));

    return {
      edits,
      count: countQuery.count,
    };
  }

  async countByQuery(query: EditQuery) {
    const [countQuery] = await db
      .select({ count: count() })
      .from(edit)
      .where(buildQuery(query));

    return countQuery.count;
  }

  async nextVersion(datasetId: number) {
    const maxVersion = await db
      .select({ maxVersion: max(edit.version) })
      .from(edit)
      .where(eq(edit.datasetId, datasetId))
      .then((res) => (res.length > 0 ? res[0].maxVersion : null));

    return maxVersion ? maxVersion + 1 : 1;
  }
}
