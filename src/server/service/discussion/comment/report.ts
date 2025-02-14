import { db } from "@/db";
import type { ReportResolutionType } from "@/db/lib/enums";
import { Enums } from "@/db/lib/enums";
import DiscussionReportReason = Enums.DiscussionReportReason;
import {
  discussionCommentReport,
  discussionCommentReportResolution,
} from "@/db/schema";

export class DiscussionCommentReportService {
  async create({
    discussionCommentId,
    reason,
    details,
    userId,
  }: {
    discussionCommentId: string;
    reason: DiscussionReportReason;
    details?: string;
    userId?: string;
  }) {
    return db.insert(discussionCommentReport).values({
      discussionCommentId,
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
    return db.insert(discussionCommentReportResolution).values({
      reportId,
      userId,
      type,
    });
  }
}
