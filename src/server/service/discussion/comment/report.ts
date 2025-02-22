import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import DiscussionReportReason = Enums.DiscussionReportReason;
import { eq } from "drizzle-orm";

import { discussionCommentReport } from "@/db/schema";

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

  async resolve({ reportId }: { reportId: string }) {
    return db
      .delete(discussionCommentReport)
      .where(eq(discussionCommentReport.id, reportId))
      .returning();
  }
}
