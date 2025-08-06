import { db } from "@packages/db";
import { Enums } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { and, eq, isNotNull, max } from "drizzle-orm";

async function maxInstanceCount() {
  const [maxInstanceCount] = await db
    .select({ max: max(dataset.instanceCount) })
    .from(dataset)
    .where(
      and(eq(dataset.status, Enums.ApprovalStatus.APPROVED), isNotNull(dataset.instanceCount)),
    );

  return maxInstanceCount.max ?? 0;
}

async function maxFeatureCount() {
  const [maxFeatureCount] = await db
    .select({ max: max(dataset.featureCount) })
    .from(dataset)
    .where(and(eq(dataset.status, Enums.ApprovalStatus.APPROVED), isNotNull(dataset.featureCount)));

  return maxFeatureCount.max ?? 0;
}

export const datasetStatService = { maxFeatureCount, maxInstanceCount };
