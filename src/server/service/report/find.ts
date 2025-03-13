import { count } from "drizzle-orm";

import { db } from "@/db";
import {
  datasetReport,
  discussionCommentReport,
  discussionReport,
} from "@/db/schema";

export namespace reportFindService {
  export async function countAll() {
    const [datasetReportCount] = await db
      .select({ count: count() })
      .from(datasetReport);

    const [discussionReportCount] = await db
      .select({ count: count() })
      .from(discussionReport);

    const [discussionCommentReportCount] = await db
      .select({ count: count() })
      .from(discussionCommentReport);

    return {
      datasetReportCount: datasetReportCount.count,
      discussionReportCount: discussionReportCount.count,
      discussionCommentReportCount: discussionCommentReportCount.count,
      totalCount:
        datasetReportCount.count +
        discussionReportCount.count +
        discussionCommentReportCount.count,
    };
  }
}
