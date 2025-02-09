import type { ReportResolutionType } from "@/db/enums";
import { Enums } from "@/db/enums";
import DiscussionReportReason = Enums.DiscussionReportReason;
import { db } from "@/db";
import { discussionReport, discussionReportResolution } from "@/db/schema";

export class DiscussionReportService {
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
    return db.insert(discussionReport).values({
      discussionId,
      reason,
      details,
      userId,
    });
  }

  async resolve({
    reportId,
    userId,
    type,
  }: {
    reportId: string;
    userId: string;
    type: ReportResolutionType;
  }) {
    return db.insert(discussionReportResolution).values({
      reportId,
      userId,
      type,
    });
  }
}
