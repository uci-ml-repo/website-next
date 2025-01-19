import type { ReportResolutionType } from "@/db/types";
import { Enums } from "@/db/types";
import DiscussionReportReason = Enums.DiscussionReportReason;
import { db } from "@/db";
import { discussionReportResolutions, discussionReports } from "@/db/schema";

export default class DiscussionsReportService {
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
    return db.insert(discussionReports).values({
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
    comment,
  }: {
    reportId: string;
    userId: string;
    type: ReportResolutionType;
    comment: string;
  }) {
    return db.insert(discussionReportResolutions).values({
      reportId,
      userId,
      type,
      comment,
    });
  }
}
