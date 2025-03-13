import { Enums } from "@/db/lib/enums";
import DiscussionReportReason = Enums.DiscussionReportReason;
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussionReport } from "@/db/schema";

export namespace reportDiscussionService {
  export async function create({
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

  export async function resolve({ reportId }: { reportId: string }) {
    return db
      .delete(discussionReport)
      .where(eq(discussionReport.id, reportId))
      .returning();
  }
}
