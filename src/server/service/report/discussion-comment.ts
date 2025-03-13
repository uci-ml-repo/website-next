import { eq } from "drizzle-orm";

import { db } from "@/db";
import type { Enums } from "@/db/lib/enums";
import { discussionCommentReport } from "@/db/schema";

export namespace reportDiscussionCommentService {
  export async function create({
    discussionCommentId,
    reason,
    details,
    userId,
  }: {
    discussionCommentId: string;
    reason: Enums.DiscussionReportReason;
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

  export async function resolve({ reportId }: { reportId: string }) {
    return db
      .delete(discussionCommentReport)
      .where(eq(discussionCommentReport.id, reportId))
      .returning();
  }
}
