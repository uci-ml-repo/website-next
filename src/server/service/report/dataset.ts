import { Enums } from "@/db/lib/enums";
import DatasetReportReason = Enums.DatasetReportReason;
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { datasetReport } from "@/db/schema";

export namespace reportDatasetService {
  export async function create({
    datasetId,
    reason,
    details,
    userId,
  }: {
    datasetId: number;
    reason: DatasetReportReason;
    details: string;
    userId?: string;
  }) {
    return db.insert(datasetReport).values({
      datasetId,
      reason,
      details,
      userId,
    });
  }

  export async function resolve({ reportId }: { reportId: string }) {
    return db
      .delete(datasetReport)
      .where(eq(datasetReport.id, reportId))
      .returning();
  }
}
