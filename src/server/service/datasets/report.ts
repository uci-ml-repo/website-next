import type {
  DatasetReportReason,
  DatasetReportResolutionType,
  PrismaClient,
} from "@prisma/client";

export default class DatasetsReportService {
  constructor(readonly prisma: PrismaClient) {}

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
    return this.prisma.datasetReport.create({
      data: {
        datasetId,
        reason,
        details: details,
        reportedByUserId: userId,
      },
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
    type: DatasetReportResolutionType;
    comment: string;
  }) {
    return this.prisma.datasetReportResolution.create({
      data: {
        reportId,
        resolvedByUserId: userId,
        type,
        comment,
      },
    });
  }
}
