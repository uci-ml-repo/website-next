import { and, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { datasetView } from "@/db/schema";

export namespace datasetStatsService {
  export async function maxDataSize() {
    const [maxInstanceCount] = await db
      .select()
      .from(datasetView)
      .orderBy(desc(datasetView.instanceCount))
      .where(
        and(
          eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
          isNotNull(datasetView.instanceCount),
        ),
      )
      .limit(1);

    const [maxFeatureCount] = await db
      .select()
      .from(datasetView)
      .where(
        and(
          eq(datasetView.status, Enums.ApprovalStatus.APPROVED),
          isNotNull(datasetView.featureCount),
        ),
      )
      .orderBy(desc(datasetView.featureCount))
      .limit(1);

    return {
      maxInstanceCount: maxInstanceCount?.instanceCount ?? 0,
      maxFeatureCount: maxFeatureCount?.featureCount ?? 0,
    };
  }
}
