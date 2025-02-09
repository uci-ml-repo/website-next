import { desc } from "drizzle-orm";

import { db } from "@/db";
import { dataset } from "@/db/schema";

export class DatasetStatsService {
  async maxDataSize() {
    const [maxInstanceCount] = await db
      .select()
      .from(dataset)
      .orderBy(desc(dataset.instanceCount))
      .limit(1);

    const [maxFeatureCount] = await db
      .select()
      .from(dataset)
      .orderBy(desc(dataset.featureCount))
      .limit(1);

    return {
      maxInstanceCount: maxInstanceCount?.instanceCount ?? 0,
      maxFeatureCount: maxFeatureCount?.featureCount ?? 0,
    };
  }
}
