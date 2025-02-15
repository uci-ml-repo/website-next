import { db } from "@/db";
import type { ReportResolutionType } from "@/db/lib/enums";
import { Enums } from "@/db/lib/enums";
import DiscussionReportReason = Enums.DiscussionReportReason;
import { commentReport, commentReportResolution } from "@/db/schema";

export class DiscussionCommentReportService {
  async create({
    commentId,
    reason,
    details,
    userId,
  }: {
    commentId: string;
    reason: DiscussionReportReason;
    details?: string;
    userId?: string;
  }) {
    return db.insert(commentReport).values({
      commentId,
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
    comment: string;
  }) {
    return db.insert(commentReportResolution).values({
      reportId,
      userId,
      type,
    });
  }
}
