import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";

export namespace discussionUpdateService {
  export async function byId({
    id,
    title,
    content,
  }: {
    id: string;
    title: string;
    content: string;
  }) {
    return db
      .update(discussion)
      .set({ title, content, updatedAt: new Date() })
      .where(eq(discussion.id, id));
  }
}
