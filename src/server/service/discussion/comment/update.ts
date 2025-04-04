import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussionComment } from "@/db/schema";

export namespace discussionCommentUpdateService {
  export async function byId({ commentId, content }: { commentId: string; content: string }) {
    return db
      .update(discussionComment)
      .set({ content, updatedAt: new Date() })
      .where(eq(discussionComment.id, commentId));
  }
}
