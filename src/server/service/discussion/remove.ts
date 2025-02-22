import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";

export class DiscussionRemoveService {
  async byId({ discussionId }: { discussionId: string }) {
    return db
      .delete(discussion)
      .where(eq(discussion.id, discussionId))
      .returning();
  }
}
