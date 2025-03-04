import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussionComment } from "@/db/schema";

export class DiscussionCommentUpdateService {
  async byId({ id, content }: { id: string; content: string }) {
    return db
      .update(discussionComment)
      .set({ content, updatedAt: new Date() })
      .where(eq(discussionComment.id, id));
  }
}
