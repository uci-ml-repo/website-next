import type { ReportResolutionType } from "@/db/types";
import { Enums } from "@/db/types";
import DatasetReportReason = Enums.DatasetReportReason;
import { db } from "@/db";
import { datasetReportResolutions, datasetReports } from "@/db/schema";

export default class DatasetsReportService {
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
    return db.insert(datasetReports).values({
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
    return db.insert(datasetReportResolutions).values({
      reportId,
      userId,
      type,
      comment,
    });
  }
}
