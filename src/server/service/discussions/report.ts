import type {
  DiscussionReportReason,
  PrismaClient,
  ReportResolutionType,
} from "@prisma/client";

export default class DiscussionsReportService {
  constructor(readonly prisma: PrismaClient) {}

  async create({
    discussionId,
    reason,
    details,
    userId,
  }: {
    discussionId: string;
    reason: DiscussionReportReason;
    details?: string;
    userId?: string;
  }) {
    return this.prisma.discussionReport.create({
      data: {
        discussionId,
        reason,
        details,
        userId,
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
    type: ReportResolutionType;
    comment: string;
  }) {
    return this.prisma.discussionReportResolution.create({
      data: {
        reportId,
        userId,
        type,
        comment,
      },
    });
  }
}
