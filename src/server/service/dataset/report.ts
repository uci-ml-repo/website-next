import type { ReportResolutionType } from "@/db/enums";
import { Enums } from "@/db/enums";
import DatasetReportReason = Enums.DatasetReportReason;
import { db } from "@/db";
import { datasetReport, datasetReportResolution } from "@/db/schema";

export class DatasetReportService {
  async create({
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

  async resolve({
    reportId,
    userId,
    type,
    comment,
  }: {
    reportId: string;
    userId: string;
    type: ReportResolutionType;
    comment: string;
  }) {
    return db.insert(datasetReportResolution).values({
      reportId,
      userId,
      type,
      comment,
    });
  }
}
