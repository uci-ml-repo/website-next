import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussionComment } from "@/db/schema";

export class DiscussionCommentRemoveService {
  async byId(discussionCommentId: string) {
    return db
      .delete(discussionComment)
      .where(eq(discussionComment.id, discussionCommentId));
  }
}
