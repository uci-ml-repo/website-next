import { eq } from "drizzle-orm";

import { db } from "@/db";
import { comment } from "@/db/schema";

export class DiscussionCommentRemoveService {
  async byId(discussionCommentId: string) {
    return db.delete(comment).where(eq(comment.id, discussionCommentId));
  }
}
