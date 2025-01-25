import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";

export default class DiscussionCountService {
  async byDatasetId(datasetId: number) {
    const [discussionCount] = await db
      .select({ count: count() })
      .from(discussion)
      .where(eq(discussion.datasetId, datasetId));
  }
}
