import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussionComment } from "@/db/schema";

export namespace discussionCommentRemoveService {
  export async function byId(discussionCommentId: string) {
    return db.delete(discussionComment).where(eq(discussionComment.id, discussionCommentId));
  }
}
