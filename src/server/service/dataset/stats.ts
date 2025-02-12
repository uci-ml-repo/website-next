import { desc, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { datasetView } from "@/db/schema";

export class DatasetStatsService {
  async maxDataSize() {
    const [maxInstanceCount] = await db
      .select()
      .from(datasetView)
      .orderBy(desc(datasetView.instanceCount))
      .limit(1);

    const [maxFeatureCount] = await db
      .select()
      .from(datasetView)
      .orderBy(desc(datasetView.featureCount))
      .where(isNotNull(datasetView.featureCount))
      .limit(1);

    return {
      maxInstanceCount: maxInstanceCount?.instanceCount ?? 0,
      maxFeatureCount: maxFeatureCount?.featureCount ?? 0,
    };
  }
}
