import { eq } from "drizzle-orm";

import { db } from "@/db";
import { comment } from "@/db/schema";

export class DiscussionCommentUpdateService {
  async byId({ id, content }: { id: string; content: string }) {
    return db
      .update(comment)
      .set({ content, updatedAt: new Date() })
      .where(eq(comment.id, id));
  }
}
